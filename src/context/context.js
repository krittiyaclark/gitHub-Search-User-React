import React, { useState, useEffect, createContext } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = createContext()

const GithubProvider = ({ children }) => {
	const [githubUser, setGithubUser] = useState(mockUser)
	const [repos, setRepos] = useState(mockRepos)
	const [followers, setFollowers] = useState(mockFollowers)
	// request, loading
	const [requests, setRequests] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	// error
	const [error, setError] = useState({
		show: false,
		msg: '',
	})

	const searchGithubUser = async (user) => {
		toggleError()
		setIsLoading(true)
		const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
			console.log(err)
		)
		if (response) {
			setGithubUser(response.data)
			const { login, followers_url } = response.data
			// repos
			axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) =>
				setRepos(response.data)
			)
			// followers
			axios(`${followers_url}?per_page=100`).then((response) =>
				setFollowers(response.data)
			)
		} else {
			toggleError(true, 'there is no user with that username')
		}
		// hide isLoading when get the data
		checkRequests()
		setIsLoading(false)
	}

	// check Requests
	const checkRequests = () => {
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				let {
					rate: { remaining },
				} = data
				// remaining = 0
				setRequests(remaining)
				if (remaining === 0) {
					// throw an error
					toggleError(true, 'sorry, you have exceeded your hourly rate limit!')
				}
			})
			.catch((error) => console.log(error))
	}

	function toggleError(show = false, msg = '') {
		setError({ show, msg })
	}

	useEffect(checkRequests, [])
	return (
		<GithubContext.Provider
			value={{
				githubUser,
				repos,
				followers,
				requests,
				error,
				searchGithubUser,
				isLoading,
			}}>
			{children}
		</GithubContext.Provider>
	)
}

export { GithubProvider, GithubContext }
