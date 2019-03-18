import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, Input, FormGroup, Label } from 'reactstrap';

class ShowForm extends React.PureComponent {

    render() {

    return Object.keys(this.props.data).map ( (element, index) => {
        let formValues = this.props.formValues
        return <FormGroup>
            
            <Label key = {index} for = {element}>{element}</Label>
            <Input  key = {element} id = {element} value = {this.props.data[element]} />
            {this.props.newElementAdded(element, this.props.data[element])}
        </FormGroup> 
    })
}
}

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      formValues:[{name:"", value:""}],
      notBlank:false
    };

    this.toggle = this.toggle.bind(this);
  }

  newElementAdded = (element,val) => {
        
 
        this.setState( prevState => ({

            formValues:[...prevState.formValues, {name:element, value:val}]
        }),() => {console.log(this.state.formValues)})
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  onclick = (e) => {
      console.log(e);
  }

  render() {
      let {inputValues} = this.state;
    return (
      <div>
        <Button color="secondary" onClick={this.toggle}>{this.props.buttonLabel}</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.props.modalTitle}</ModalHeader>
          <ModalBody>
            <Form >
                <ShowForm formValues = {this.state.formValues} newElementAdded = {this.newElementAdded} data = {this.props.data} />
                <Button onClick = {this.onclick}>Submit</Button>
            </Form>
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