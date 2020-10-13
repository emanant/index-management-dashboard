/*
* This class uses state to update the component
* Changes modifies the state of the component
*/

import React, { Component } from 'react';
import ReactDragListView from 'react-drag-listview';
import { Row, Col, ListGroup, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { BsArrowsMove, BsArrowRightShort, BsArrowLeftShort, BsFillTrashFill, BsPlusCircle, BsFileEarmarkText } from 'react-icons/bs';

import './Board.scss'

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.board.id,
            boardName: this.props.board.name,
            boardData: this.props.board.data,
            // saving: this.props.saving
        }
    }

    addIndent = (i) => {
        var currIndent = this.state.boardData[i].indent;
        if (currIndent < 1) {
            currIndent += 1;
            this.setState(prevState => ({
                boardData: prevState.boardData.map(
                    (el, ind) => ind === i ? { ...el, indent: currIndent } : el
                )
            }));
        }
    }

    removeIndent = (i) => {
        var currIndent = this.state.boardData[i].indent;
        if (currIndent > 0) {
            currIndent -= 1;
            this.setState(prevState => ({
                boardData: prevState.boardData.map(
                    (el, ind) => ind === i ? { ...el, indent: currIndent } : el
                )
            }));
        }
    }

    addRow = () => {
        this.setState(prevState => {
            var newData = [...prevState.boardData];
            newData.push({ text: '', indent: 0 });
            return { ...prevState, boardData: newData }
        })
    }

    removeRow = (i) => {
        var len = this.state.boardData.length;
        if (len > 1) {
            var count = i + 1;
            const pIndent = this.state.boardData[i].indent;
            while (count < len && this.state.boardData[count].indent > pIndent) count++;
            this.setState(prevState => {
                var newData = [...prevState.boardData];
                newData.splice(i, count - i);
                return { boardData: newData }
            })
        } else {
            this.setState(prevState => (
                { boardData: [{ text: '', indent: 0 }] }
            ))
        }
    }

    onInputChange = (value, i) => {
        var newData = [...this.state.boardData];
        newData[i].text = value;
        this.setState({ boardData: newData });
    }

    onChangeHeader = (value) => {
        this.setState({
            boardName: value
        })
    }

    render() {
        const that = this;
        const dragProps = {
            onDragEnd(fromIndex, toIndex) {
                console.log("fromIndex:", fromIndex, " toIndex:", toIndex);
                const data = [...that.state.boardData];
                const len = data.length;

                var fi2 = fromIndex + 1;
                while (fi2 < len && data[fi2].indent === 1) fi2++;
                fi2--;
                var packageLen1 = fi2 - fromIndex + 1

                var ti2 = toIndex + 1;
                while (ti2 < len && data[ti2].indent === 1) ti2++;
                ti2--;

                const item = data.splice(fromIndex, packageLen1);
                if (fromIndex > toIndex) {
                    const final = [
                        ...data.slice(0, toIndex),
                        ...item,
                        ...data.slice(toIndex),
                    ]
                    that.setState({ boardData: final });
                } else {
                    const final = [
                        ...data.slice(0, ti2 + 1 - packageLen1),
                        ...item,
                        ...data.slice(ti2 + 1 - packageLen1),
                    ]
                    that.setState({ boardData: final });
                }
            },
            nodeSelector: 'li',
            handleSelector: 'div'
        };
        return (
            <>
                <ListGroup>
                    <ListGroup.Item className='board-header d-flex'>
                        <input placeholder='Board Name..' className='justify-self'
                            onChange={(event) => this.onChangeHeader(event.target.value)}
                            value={this.state.boardName.toUpperCase()} />
                        <OverlayTrigger className='ml-auto' overlay={<Tooltip id="tooltip-disabled">Remove</Tooltip>}>
                            <BsFillTrashFill className='mr-2 float-right' size='1.2em' onClick={() => this.props.removeBoard(this.state)} />
                        </OverlayTrigger>
                        <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Save</Tooltip>}>
                            <BsFileEarmarkText className='mr-2 float-right' size='1.2em' onClick={() => this.props.saveBoard({ id: this.state.id, name: this.state.boardName, data: this.state.boardData })} />
                        </OverlayTrigger>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col xs lg='2' className='text-left'>
                                <div className='d-flex flex-column board-sub-header'>
                                    <h5>Actions</h5>
                                    <span>Move, Indent, Outdent, Delete</span>
                                </div>
                            </Col>
                            <Col xs lg='2' className='text-left'>
                                <div className='d-flex flex-column board-sub-header'>
                                    <h5>Standard</h5>
                                    <span>The text of the standard</span>
                                </div>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                    <ReactDragListView {...dragProps} >
                        <div as='ol'>
                            {this.state.boardData.map((data, i) => (
                                <ListGroup.Item as={data.indent ? `div` : `li`} key={i} className='text-left py-0' >
                                    <Row className='board-row'>
                                        <Col xs lg='2' className='py-2 col-icons'>
                                            <button className='button-dragger'><OverlayTrigger as='button' overlay={<Tooltip id="tooltip-disabled">Move</Tooltip>}>
                                                <BsArrowsMove className='mr-2' size='1.2em' />
                                            </OverlayTrigger></button>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Outdent</Tooltip>}>
                                                <BsArrowLeftShort className='mr-2' size='1.2em' onClick={() => this.removeIndent(i, 'O')} />
                                            </OverlayTrigger>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Indent</Tooltip>}>
                                                <BsArrowRightShort className='mr-2' size='1.2em' onClick={() => this.addIndent(i, 'I')} />
                                            </OverlayTrigger>
                                            <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Delete</Tooltip>}>
                                                <BsFillTrashFill className='mr-2' size='1.2em' onClick={() => this.removeRow(i)} />
                                            </OverlayTrigger>
                                        </Col>
                                        <Col xs={1} className={`pl-0 indent-` + data.indent}>
                                            <div className={`col-separator `} />
                                            {/* <div className={`col-separator ` + `ml-` + (data.indent ? data.indent + 1 : 0)} /> */}
                                        </Col>
                                        <Col className={`p-2 col-text indent-text-` + data.indent}>
                                            <input placeholder='Type standard here (e.g. Numbers)'
                                                onChange={(event) => this.onInputChange(event.target.value, i)}
                                                value={data.text.charAt(0).toUpperCase() + data.text.slice(1)} />
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </div>
                    </ReactDragListView>
                </ListGroup>

                < Button className='add-button mt-2 btn-block' onClick={this.addRow}>
                    <BsPlusCircle className='mr-2' size='1.2em' />
                        Add a standard
                </Button>
            </>
        )
    }
}

export default Board;