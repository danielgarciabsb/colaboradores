import React, {Component} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Jumbotron from "react-bootstrap/Jumbotron";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUsers, faSave, faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import Logout from "../../Login/Logout";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import api from "../../../services/api";
import _ from 'lodash';
import ContatoList from "./ContatoList";
import "./css/Editor.css"
import ExperienciaList from "./ExperienciaList";

class Editor extends Component {

    state = {
        showModal: null,

        nome_colaborador: '',
        cargo_colaborador: '',
        time_colaborador: '',
        competencias_colaborador: [],
        experiencias_colaborador: [],
        contatos_colaborador: [],

        cargos_autocomplete: [],
        times_autocomplete: [],
        competencias_autocomplete: [],

        cargo_experiencia: '',
        tecnologias_experiencia: '',
        atividades_experiencia: ''
    };

    async componentDidMount() {
        let cargos = await api.get('/cargo/list');
        let cargosList = _.map(cargos.data, _.property('name'));

        let times = await api.get('/time/list');
        let timeList = _.map(times.data, _.property('name'));

        let competencias = await api.get('/competencia/list');
        let competenciasList = _.map(competencias.data, _.property('name'));

        this.setState({cargos_autocomplete: cargosList});
        this.setState({times_autocomplete: timeList});
        this.setState({competencias_autocomplete: competenciasList});
    }

    constructor(props) {
        super(props);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.addContact = this.addContact.bind(this);
        this.addExperiencia = this.addExperiencia.bind(this);
        this.cargoExpHandler = this.cargoExpHandler.bind(this);
        this.tecnologiasExpHandler = this.tecnologiasExpHandler.bind(this);
        this.atividadesExpHandler = this.atividadesExpHandler.bind(this);
        this.doSave = this.doSave.bind(this);
        this.nameHandler = this.nameHandler.bind(this);
    }

    showModal(id) {
        this.setState({showModal: id});
    }

    hideModal() {
        this.setState({showModal: null});
    }

    addContact(tipo, valor) {
        this.setState({contatos_colaborador: this.state.contatos_colaborador.concat({
                tipo: tipo, valor: valor
            })})
    }

    addExperiencia(){
        this.hideModal();
        this.setState({experiencias_colaborador: this.state.experiencias_colaborador.concat({
                cargo: this.state.cargo_experiencia,
                atividades: this.state.atividades_experiencia,
                tecnologias: this.state.tecnologias_experiencia
        })});
        this.setState({cargo_experiencia: ''});
        this.setState({tecnologias_experiencia: ''});
        this.setState({atividades_experiencia: ''});
    }

    nameHandler(name) {
        this.setState({nome_colaborador: name.target.value});
    }

    cargoExpHandler(cargo) {
        this.setState({cargo_experiencia: cargo});
    }

    tecnologiasExpHandler(tecnologias) {
        this.setState({tecnologias_experiencia: tecnologias.target.value});
    }

    atividadesExpHandler(atividades) {
        this.setState({atividades_experiencia: atividades.target.value});
    }

    async doSave() {
        let colaborador = {
            name: this.state.nome_colaborador,
            cargo: this.state.cargo_colaborador,
            time: this.state.time_colaborador,
            competencias: this.state.competencias_colaborador,
            experiencias: this.state.experiencias_colaborador,
            contatos: this.state.contatos_colaborador,
        };
        let saveResponse = await api.post('/colaborador/add', colaborador);
        console.log(saveResponse);
    }

    render() {
        return <Container>
            <Logout />
            <Row>
                <Col>
                    <h1 className="titulo"><FontAwesomeIcon icon={faUsers}/> Adicionar Colaborador</h1>
                </Col>
            </Row>
            <Jumbotron>
                <Row style={{ marginBottom: '2rem' }}>
                    <Col>
                        <Link to="/colaboradores">
                            <Button variant="secondary" size="lg"><FontAwesomeIcon icon={faChevronLeft} /> Voltar</Button>{' '}
                        </Link>
                        <Button variant="success" size="lg" onClick={() => this.doSave()} ><FontAwesomeIcon icon={faSave} /> Salvar</Button>{' '}
                    </Col>
                </Row>
            <Row>
                <Col>
                    <Row>
                        <Col lg={10}>
                            <TextField fullWidth id="outlined-basic" label="Nome" variant="outlined"
                                       onChange={this.nameHandler}
                                       style={{backgroundColor: "white", marginTop: "5px"}}
                            />
                        </Col>
                        <Col lg={10}>
                            <Autocomplete
                                id="cargo"
                                freeSolo
                                options={this.state.cargos_autocomplete}
                                renderInput={(params) => (
                                    <TextField {...params} label="Cargo" variant="outlined"
                                               style={{backgroundColor: "white", marginTop: "5px"}}
                                    />
                                )}
                            />
                        </Col>
                        <Col lg={10}>
                            <Autocomplete
                                id="time"
                                freeSolo
                                options={this.state.times_autocomplete}
                                renderInput={(params) => (
                                    <TextField {...params} label="Time" variant="outlined"
                                               style={{backgroundColor: "white", marginTop: "5px"}}
                                    />
                                )}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
                <Row>
                    <Col>
                        <h2 className="subtitulo">Experiências Profissionais</h2>
                        <ExperienciaList experiencias={this.state.experiencias_colaborador}/>
                        <Button className="botao" variant="primary" onClick={() => this.showModal('addExp')}>
                            Adicionar experiência
                        </Button>
                        <Modal
                            show={this.state.showModal === 'addExp'}
                            onHide={this.hideModal}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            backdrop="static"
                            centered
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Adicionar Experiência Profissional
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Container>
                                    <Row>
                                        <Col>
                                            <Autocomplete
                                                id="cargo"
                                                freeSolo
                                                options={this.state.cargos_autocomplete}
                                                onInputChange={(event, newInputValue) => {
                                                    this.cargoExpHandler(newInputValue);
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Cargo" variant="outlined"
                                                               style={{backgroundColor: "white", marginTop: "5px"}}
                                                    />
                                                )}
                                            />
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>Atividades</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl as="textarea" aria-label="Atividades" onChange={this.atividadesExpHandler} />
                                            </InputGroup>
                                            <InputGroup>
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text>Tecnologias</InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl as="textarea" aria-label="Tecnologias" onChange={this.tecnologiasExpHandler}/>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={() => this.addExperiencia()}>Adicionar</Button>
                            </Modal.Footer>
                        </Modal>
                        <h2 className="subtitulo">Competências</h2>
                        <Autocomplete
                            multiple
                            freeSolo
                            id="tags-standard"
                            options={this.state.competencias_autocomplete}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Adicionar Competências"
                                    placeholder="Digite enter para incluir uma nova competência"
                                />
                            )}
                        />
                        <h2 className="subtitulo">Contatos</h2>
                        <Button className="botao" variant="primary" onClick={() => this.addContact()}>
                            Adicionar contato
                        </Button>
                        <ContatoList contatos={this.state.contatos_colaborador}/>
                    </Col>
                </Row>
            </Jumbotron>
        </Container>
    }
}

export default Editor;
