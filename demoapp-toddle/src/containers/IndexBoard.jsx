import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import { BsPlusCircle } from 'react-icons/bs';

import BoardComponent from '../components/Board';
import './indexBoard.scss';


class IndexBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idCount: 0,
            boards: [],
            fileName: ''
        }
    }

    componentDidMount() {
        fetch(`/readjson`)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log('fetched on mount : ', result);
                    this.setState(result);
                },
                (error) => {
                    console.log('fetching on mount error:', error);
                }
            )
    }

    saveBoard = async (newBoard, boardId) => {
        const { boards } = this.state;
        const index = boards.findIndex(x => x.id === boardId);
        const updatedBoards = [
            ...boards.slice(0, index),
            Object.assign({}, newBoard),
            ...boards.slice(index + 1)
        ]
        const updatedState = Object.assign({}, this.state, { boards: updatedBoards })
        const that = this;
        fetch('/writejson', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(updatedState)
        }).then(resp => resp.json())
            .then(
                // (res) => this.setState({updatedState}),
                (res) => that.setState({ boards: updatedBoards }, () => console.log("Board Saved ", newBoard)),
                (err) => console.log(`Couldn't save Error: ${err} `),

            );
    }

    // handleSaveToPC = jsonData => {
    //     const fileData = JSON.stringify(jsonData);
    //     const blob = new Blob([fileData], { type: "text/plain" });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.download = 'filename.json';
    //     link.href = url;
    //     link.click();
    // }

    removeBoard(boardId) {
        const { boards } = this.state;
        const index = boards.findIndex(x => x.id === boardId);
        this.setState({
            boards: [
                ...boards.slice(0, index),
                ...boards.slice(index + 1)
            ]
        })
    }

    addBoard() {
        this.setState({
            boards: [
                ...this.state.boards,
                { id: this.state.idCount + 1, name: '', data: [{ text: '', indent: 0 }] }
            ],
            idCount: this.state.idCount + 1
        });
    }

    render() {
        // console.log('container state : ', this.state);
        return (
            <Container fluid='md' className='board-container-main'>
                {this.state.boards.map((board, i) => (
                    < BoardComponent className='my-2 py-2' key={board.id} board={board} saving={this.state.saving}
                        addBoard={() => this.addBoard()}
                        removeBoard={() => this.removeBoard(board.id)}
                        saveBoard={(newBoard) => this.saveBoard(newBoard, board.id)} />
                ))}
                < Button className='add-button mt-5 float-left outline-primary' onClick={() => this.addBoard()}>
                    <BsPlusCircle className='mr-2' size='1.2em' />
                        Add new board
                </Button>

            </Container>
        )
    }
}

export default IndexBoard;