import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactDOM from 'react-dom/client';
import Button from '@mui/material/Button';
import './style.css';
import { height } from "@mui/system";
import { colors } from "@mui/material";


function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  var [currstate, setCurrstate] = useState("home");
  var [currpage, setCurrpage] = useState(1);
  var [currCollection, setCurrcollection] = useState([]);
  var [tempCollection, setTempcollection] = useState("");
  var [formbody, setFormbody] = useState("");
  var [formhead, setFormhead] = useState("");
  var [formlink, setFormlink] = useState("");

  var [subpagecollection, setSubpagecollection] = useState([]);
  var [subpagestate, setSubpagestate] = useState([]);
  var [currid,setCurrid]=useState("NA")

  useEffect(() => {
    axios.get("http://localhost:5000/api/getAll").then((response) => {
      setCurrcollection(response.data);
    });
  }, []);


  const getCollection = async () => {
    // axios.get("http://127.0.0.1:5000/getList").then((response) => {
    //   setCurrCollection(response.data);
    // });
  }
  const homePageadmin = async () => {
    setCurrstate("login")
  }
  const homePageuser = async () => {
    setCurrstate("user")
  }
  const homePagehome = async () => {
    setCurrstate("home")
  }
  const backsubpage = async () => {
    setCurrpage(1)
  }


  const openSubsubject = async (e) => {
  // function openSubsubject(_id) {
    console.log(e._id)
    setCurrid(e._id)
    axios.get(`http://localhost:5000/api/getAllsub/${e._id}`).then((response) => {
     
      setSubpagecollection(response.data)
      setCurrpage(2)
     
    });

  }



  function handleSubmit(e) {
    e.preventDefault();

    fetch('http://127.0.0.1:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.success === true)
          setCurrstate("admin")
        else
          setCurrstate("home")
      })
      .catch(error => console.error(error));

  }

  const handleNewSubjectChange = (event) => {
    setTempcollection(event.target.value);
  };
  const handleNewHeadingChange = (event) => {
    setFormhead(event.target.value);
  };
  const handleNewDetailChange = (event) => {
    setFormbody(event.target.value);
  };
  const handleNewLinkChange = (event) => {
    setFormlink(event.target.value);
  };


  const handleNewSubjectSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://127.0.0.1:5000/api/addSubject", { text: tempCollection })
      .then((response) => {
  
        setCurrcollection([...currCollection, response.data]);
        setTempcollection("");
      });
  };
  const handleNewSubSubjectSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://127.0.0.1:5000/api/addSubSubject", { 
        Body:formbody,
        Heading: formhead,
        Link:formlink,
        Parent:currid})
      .then((response) => {
        setCurrpage(1)
      
      });
  };



  if (currstate === "home")
    return (
      <div>
        <center>
            <h1>Class Announcement</h1>
            <br/>
            <br/>
            <Button variant="contained" style={{ margin: '40px' , fontSize:'40px' } } onClick={homePageuser}>User</Button>
            <Button variant="contained" style={{ margin: '40px' , fontSize:'40px' } } onClick={homePageadmin}>Admin</Button>
        </center>
      </div>
    );
  if (currstate === "login")
    return (
      <div>
        <button onClick={homePagehome}>Back</button>
        <br />
        <center>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </label>
          <br />
          <br />
          <button type="submit">Submit</button>
        </form>
        </center>
      </div>
    );
  if (currstate === "user") {
    if (currpage === 1) {
      return (
        <div>
          <ul>
            {currCollection.map((currCollections) => (
              // {console.log(currCollection)}
              <center>
              <div>
                
                  <button style={{fontSize:'35px', height:'80px', width:'500px',borderRadius:'20px'}}onClick={(e)=> {openSubsubject(currCollections)}}>{currCollections.Subject}</button>
                 
                <br/>
                <br/>
              </div>
               </center>

            ))}
          </ul>
        </div>
      );
    }
    if (currpage === 2) {
      return (
        <div>
             <button onClick={backsubpage}>Back</button>
             <center>
           {subpagecollection.map((temp) => (
              // {console.log(currCollection)}
              <div style={{background:'#6096B4', width:'400px',borderRadius:'20px'}}>
                <span>
                <h3>{temp.Heading}</h3>
                  {temp.Body}
                  <br/>
                  <br/>
                  <a href={temp.Link}>Link</a>
                </span>
                <br />
                
              </div>

            ))}
            </center>
        </div>
      );
    }
  }



  if (currstate === "admin") {
    if (currpage === 0) {
      return (
        <div>
          0
        </div>
      );
    }
    if (currpage === 1) {
      return (
        <div>
          <center>
          <ul>
            {currCollection.map((currCollections) => (
              // {console.log(currCollection)}
              
              <div>
                
                  <button style={{fontSize:'35px', height:'80px', width:'500px'}}onClick={(e)=> {openSubsubject(currCollections)}}>{currCollections.Subject}</button>
                 
                <br/>
                <br/>
              </div>
              

            ))}
          </ul>
          <form onSubmit={handleNewSubjectSubmit}>
            <input
              type="text"
              placeholder="Enter new Subject"
              value={tempCollection}
              onChange={handleNewSubjectChange}
            />
            <br/>
            <button type="submit">Add</button>
          </form>
          </center>
        </div>
      );
    }
    if (currpage === 2) {
      return (
        <div>
          <button onClick={backsubpage}>Back</button>
          <br/>
            <br/>
          <form onSubmit={handleNewSubSubjectSubmit}>
            <input
              type="text"
              placeholder="Enter Heading"
              value={formhead}
              onChange={handleNewHeadingChange}
            />
            <br/>
            
            <input
              type="text"
              placeholder="Enter Details"
              value={formbody}
              onChange={handleNewDetailChange}
            />
            <br/>
            
            <input
              type="text"
              placeholder="Enter Link (Optional)"
              value={formlink}
              onChange={handleNewLinkChange}
            />
            <br/>
            
            <button type="submit">Add</button>
          </form>

          <center>
           {subpagecollection.map((temp) => (
              // {console.log(currCollection)}
              <div style={{background:'#6096B4', width:'400px',borderRadius:'20px'}}>
                <span>
                <h3>{temp.Heading}</h3>
                  {temp.Body}
                  <br/>
                  <br/>
                  <a href={temp.Link}>Link</a>
                </span>
                <br />
                
              </div>

            ))}
            </center>
        </div>
      );
    }
  }



}

export default App;
