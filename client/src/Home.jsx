import { Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

const getGoogleAuthUrl = () => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth`
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URI } = import.meta.env
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'].join(
      ' '
    ),
    prompt: 'consent',
    access_type: 'offline' // to get refresh token on server
  }

  const queryString = `${url}?${new URLSearchParams(query).toString()}`
  return queryString
}
const googleOAuthUrl = getGoogleAuthUrl()

export default function HomePage() {
  const isAuthenticated = Boolean(localStorage.getItem('access_token'))
  return (
    <>
      <div>
        <span>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </span>
        <span>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </span>
      </div>
      <h1>Google OAuth 2.0</h1>
      <p className='read-the-docs'>
        {isAuthenticated ? (
          <>
            <button
              onClick={() => {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                window.location.reload()
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to={googleOAuthUrl}>Login with Google</Link>
        )}
      </p>
      <video controls width={500}>
        {/* <source src='http://localhost:4000/medias/videos/ce87c6f13a427e73b32fbb900.mp4' type='video/mp4' /> */}
        <source src='http://localhost:4000/medias/videos-stream/ce87c6f13a427e73b32fbb900.mp4' type='video/mp4' />
      </video>
    </>
  )
}
