import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import { getTodos } from "./api"
import { getTodo } from "./api"
import { removeTodo } from "./api"
import { createTodo } from "./api"
import { useHistory } from "react-router-dom";

class App extends React.Component{

  state = {
    tasks: []
  };

  async componentDidMount(){
    const tasks = await getTodos();
    this.setState({tasks: tasks});
  }

  render(){
    console.log(this.state.tasks);
    return(
      <div className= 'wrapper'>
        <div className='card frame'>
          <Header numOfTasks={this.state.tasks.length} />
          <TodoList tasks = {this.state.tasks} onDelete={this.handleDelete} />
          <SubmitForm onFormSubmit = {this.handleSubmit} />
        </div>
      </div>
    );
  }

  handleDelete = async (index) => {
    console.log(index);
    const result = await removeTodo (index);
    const result2 = await result.json();
    console.log(result2);
    const tasks = await getTodos();
    this.setState({tasks: tasks});
  }


  handleSubmit = async (task) => {
    console.log("Im submitting");
    await createTodo(task);
    const tasks = await getTodos();
    console.log(tasks);
    this.setState({tasks: tasks});
    console.log(this);

  }
}


class SubmitForm extends React.Component{
  state = {term: ''};

  handleSubmit = (e) => {
    console.log("Im handling sumbit");
    e.preventDefault();
    if(this.state.term === '') return;
    this.props.onFormSubmit(this.state.term);
    this.setState({term: ''});

  }


  render() {
    return(
      <form onSubmit = {this.handleSubmit}>
        <input
          type = 'text'
          className = 'input'
          placeholder = 'What shall we do today, sir?'
          value={this.state.term}
          onChange={(e) => this.setState({term: e.target.value})}
          />
        <button className ='button'>Add task</button>
      </form>
    );
  }
}

const TodoList = (props) =>{

  const todos = props.tasks.map((todo, index) =>{
    return <Todo content={todo.text} key = {index} id ={todo._id} onDelete ={props.onDelete} />
  })

  return (
    <div className ='list-wrapper'>
      {todos}
    </div>
  );
}

const Todo = (props) =>{
  return(
    <div className = 'list-item'>
      {props.content}
      <button className = "delete is-pulled-right" onClick = {() => {props.onDelete(props.id)}}> </button>
    </div>
  );
}

const Header = (props) =>{
  return(
    <div className ='card-header'>
      <h1 className='card-header-title header'>
        Today's todo list:
      </h1>
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.querySelector('#root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
