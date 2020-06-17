import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

import './Chat.css';


let socket;

const Chat = () =>{

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    const ENDPINT = 'localhost:5000';

    useEffect(()=> {
        const { name, room } = queryString.parse(window.location.search);

        socket = io(ENDPINT);

        setName( name );
        setRoom( room );

        socket.emit('join', { name, room }, ()=>{

        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPINT, window.location.search])

    useEffect(()=> {
        socket.on('message', ( message )=> {
            setMessages([...messages, message ]);
        })
    }, [messages])

    useEffect(()=>{
        socket.on('roomData', ({ room, users })=>{
            setUsers([...users]);
        })
    }, [users])


    const sendMessage = ( event ) => {
        event.preventDefault();
        if(message)
            socket.emit('sendMessage', message, ()=> setMessage(''));
    }

    //console.log(message, messages);

    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room = { room }></InfoBar>
                <Messages messages= { messages } name={ name } />
                <Input message = { message } setMessage = { setMessage } sendMessage = { sendMessage }></Input>
            </div>
            <TextContainer users = { users }></TextContainer>
        </div> 
    )
}

export default Chat;