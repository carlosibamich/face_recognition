import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js'
import Navigation from '../components/navigation/Navigation';
import Logo from '../components/logo/Logo';
import ImageLinkForm from '../components/imagelinkform/ImageLinkForm';
import Rank from '../components/rank/Rank';
import SignIn from '../components/signin/SignIn';
import Register from '../components/register/Register'
import FaceRecognition from '../components/facerecognition/FaceRecognition';

const particleOptions = {
  particles: {
    number: {
      value: 138,
      density: {
        enable: true,
        value_area: 600
      }
    },
    opacity: {
      value: 0.15,
      random: true
    }
  },
  interactivity: {
    onhover: {
      enable: true,
      mode: "repulse"
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({ user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage')
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = box => {
    this.setState({ box });
  }

  handleInputChange = e => {
    this.setState({ input: e.target.value });
  }

  handlePictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(res => res.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count }))
        })
        .catch(console.log);
      }
    this.displayFaceBox(this.calculateFaceLocation(res))
    })
    .catch(err => console.log(err));
  }

  handleRouteChange = route => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route });
  }

  render() {
    const { isSignedIn, route, box, imageUrl } = this.state;
    return (
      <div className="App">
        <Particles
          className="particles"
          params={particleOptions}
        />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.handleRouteChange} />
        { route === 'home'
          ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.handleInputChange}
              onPictureSubmit={this.handlePictureSubmit} />
            <FaceRecognition box={box} imgUrl={imageUrl} />
          </div>
          :
          (
            route === 'signin'
            ?
            <SignIn loadUser={this.loadUser} onRouteChange={this.handleRouteChange}/>
            :
            <Register onRouteChange={this.handleRouteChange} loadUser={this.loadUser}/>
          )
        }
      </div>
    )
  }
}

export default App;
