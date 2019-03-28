import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Input, FormGroup, Label } from 'reactstrap';

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      formValues:{},
      length:0
    };
    this.toggle = this.toggle.bind(this);
  }

  // shouldComponentUpdate( nextProps, nextState) {
  //   return next
  // }

  componentDidMount() {
      setTimeout(() => {
        this.setFormValues();
        //console.log("data in modal ",this.state.formValues);
      },200);
  }

  setFormValues() {
    //console.log("data received => ",this.props.data);
    var len = Object.keys(this.props.data).length;
    this.setState({
      formValues: this.props.data,
      length:len
    })

  }

  componentDidUpdate(prevProps) {
    if(this.props.data !== prevProps.data) {
      this.setFormValues();
    }
  }

  handleChange = (event) => {

    let stateValues = this.state.formValues;
    stateValues[event.target.id] = event.target.value;

    this.setState({
      formValues: stateValues
    })
    
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  onclick = () => {
    
    let id = this.state.formValues[this.props.id];
    let data = this.state.formValues;
    
    console.log(" inside submit button of edit, data => ", data);
    this.props.edit(id, data, this.props.index);
  }

  render() {
    
    const formElement = (name, value, index) => {
      return <FormGroup key = {index}>
        <Label>{name}</Label>
        <Input id = {name} onChange = {(e) => this.handleChange(e)} value={value}/>
      </FormGroup>
    }

    const showForm = () => {
      let {formValues} = this.state;
      return <Form> 
      {
        Object.keys(formValues).map( (element, index) => {
          return formElement(element, formValues[element], index)
        })
      }
      <Input type="submit" value="Submit" onClick = {(e) => this.onclick(e)} /> 
      </Form>
    }

    return (
      <div>
        <Button color="secondary" onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.modalTitle}</ModalHeader>
          <ModalBody>
            {showForm()}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Do Something</Button>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default EditModal;