import "./index.scss"

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { buscarEquipes, buscarModalidades } from '../../API/chamadas';
import { useAuth } from "../../Components/UserContext/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardModalidae from '../../Components/CardModalidade';


export default function Equipes() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [equipes, setEquipes] = useState([]);
    const location = useLocation();
    const { id, img, modalidade } = location.state || {};
    const [selectedModalidade, setSelectedModalidade] = useState({
        id: id,
        img: img,
        modalidade: modalidade
    });
    const [modalidades, setModalidades] = useState([]);

    const handleButtonClick = () => {
       // if (isAuthenticated) {
            navigate('/FormularioEquipe');
      //  } else {
      //     toast.info("Por favor, faça login novamente");
      //  }
    };


    const handleChange = (event) => {
        // Filtra para encontrar a modalidade correspondente
        const modalidade = modalidades.find(mod => mod.idModalidade === Number(event.target.value));

        if (modalidade) {
            // Atualiza todo o objeto `selectedModalidade` de uma vez
            setSelectedModalidade({
                id: modalidade.idModalidade,
                modalidade: modalidade.Nome,
                img: modalidade.Foto
            });
        }
    };

    let filteredEquipes = equipes;

    if (selectedModalidade.modalidade !== 'all') {
        filteredEquipes = equipes.filter(equipe =>
            equipe.idModalidade === selectedModalidade.id
        );
    }

    useEffect(() => {
        const busca = async () => {
            try {
                const equipes = await buscarEquipes();
                const modalidades = await buscarModalidades();

                setModalidades(modalidades);
                setEquipes(equipes);
                console.log(equipes);

            } catch (error) {
                console.log(error);
            }
        }
        busca();
    }, [])

    return (
        <div className="Equipes">
            <div className="opcao">
                <label>Lista de equipes na modalidade </label>
                <FormControl sx={{ m: 1, minWidth: 200, height: '20px' }}>
                    <Select
                        value={selectedModalidade.id}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ height: '30px' }}
                    >
                        <MenuItem value="all">
                            <em>Todos</em>
                        </MenuItem>
                        {modalidades.map(modalidade => (
                            <MenuItem key={modalidade.idModalidade} value={modalidade.idModalidade}>{modalidade.Nome}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <button className="botaoEquipe" onClick={handleButtonClick}>Criar Equipe</button>
            </div>
            <div style={{ padding: '0 10%' }} className="listaEquipes">
                {filteredEquipes.map(equipe => (
                    <CardModalidae id={equipe.idEquipe} img={selectedModalidade.img} modalidade={selectedModalidade.modalidade} equipe={equipe}></CardModalidae>
                ))}
            </div>
        </div>
    )
}