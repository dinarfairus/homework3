import React from 'react';
import './App.css';
import { useEffect, useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

function App() {
    const CLIENT_ID = "1f31061be48a442d8d9de8ecfaaa4f13"
    const REDIRECT_URI = "http://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const SCOPE = 'playlist-modify-private'
    const RESPONSE_TYPE = "token"

    const [userAccessToken, setToken] = useState("")
    const [search, setSearch] = useState("")
    const [albums, setAlbums] = useState([])

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const select = () => {

    }

    const searchAlbums = async (e) => {
        e.preventDefault()
        const { data } = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${userAccessToken}`
            },
            params: {
                q: search,
                type: "artist"
            }
        })

        setAlbums(data.artists.items)
    }

    const renderAlbums = () => {
        return albums.map(artist => (
            <div className="container-card">
                <Card className="card" style={{ width: '20rem' }}>
                    <Card.Body>
                        <div
                            key={artist.id}>
                            <h3 >{artist.name}</h3>
                            {artist.images.length ? <img width={"35%"} src={artist.images[0].url} alt="" /> : <div>No Image</div>}
                            <br></br>
                            <Button className='btnSelected' variant="outline-primary" size="sm" onClick={logout}>Selected </Button>{' '}
                        </div>
                    </Card.Body>
                </Card>
                
            </div>
        ))
    }

    return (
        <div className="App">
            <header className="App-header">

                <h1>Spotify API</h1>
                <div className="header">
                    <Button className='btnLogout' variant="danger" onClick={logout}>Logout</Button>
                </div>

                {userAccessToken ?
                    <div className="search">
                        <Form style={{ width: '20rem' }} onSubmit={searchAlbums}>
                            <Form.Control type="text" placeholder="Search Your Music" onChange={e => setSearch(e.target.value)} />
                            <Button className="btnSearch" as="input" type="submit" value="Search" />{' '}
                        </Form>
                    </div>
                    : <div></div>
                }
                {!userAccessToken ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Login
                        to Spotify</a>
                    : <div></div>}

                {renderAlbums()}

            </header>
        </div>
    );
}

export default App;