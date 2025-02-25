import { useState, useEffect} from 'react'
import Header from './components/Header'
import IconoNuevoGasto from './img/nuevo-gasto.svg'
import Modal from './components/Modal'
import ListadoGastos from './components/ListadoGastos'
import { generarId } from './helpers'
import { object } from 'prop-types'
import Filtros from './components/Filtros'


function App() {

const [presupuesto,setPresupuesto]=useState(
 Number (localStorage.getItem('presupuesto')??0
  ))
const [isValidPresupuesto, setIsValidPresupuesto] = useState(false)
const [modal, setModal] =useState(false)
const [animarModal, setAnimarModal] =useState(false)
const [gastos, setGastos] =useState(
  localStorage.getItem('gastos') ? JSON.parse(localStorage.getItem('gastos')) : []
)
const [gastoEditar, setGastoEditar] =useState({})

const [filtro,setFiltro] = useState('')
const [gastosFiltrados,setGastosFiltrados] = useState([])

useEffect(()=>{
if(Object.keys(gastoEditar).length>0){
  setModal(true)
  setTimeout(()=>{
  setAnimarModal(true)
  },500)
}
},[gastoEditar])

useEffect(()=>{
localStorage.setItem('presupuesto',presupuesto??0)
},[presupuesto])

useEffect(()=>{
  if(filtro){
    //filtrar gastos por categoria
    const gastosFiltrados= gastos.filter(gasto=>gasto.filtro.categoria === filtro)

    setGastosFiltrados(gastosFiltrados)
  }
},[filtro])

useEffect(()=>{
const presupuestols =Number(localStorage.getItem('presupuesto')) ?? 0
if (presupuestols>0){
  setIsValidPresupuesto(true)
}
},[])

useEffect(()=>{
  
  localStorage.setItem('gastos',JSON.stringify(gastos) ?? [])


  },[gastos])

const handleNuevoGasto =()=>{
setModal(true)
setGastoEditar({})
setTimeout(()=>{
setAnimarModal(true)
},500)
}

const guardarGasto = gasto =>{
if(gasto.id){
  //actualizar
  const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState)
  setGastos(gastosActualizados)
  setGastoEditar({})
}else{
//nuevo gasto
gasto.id = generarId()
gasto.fecha = Date.now()
setGastos([...gastos,gasto])
}
  setAnimarModal(false)
    setTimeout(()=>{
      setModal(false)
    },500)
    
  
}

const eliminarGasto = id =>{
  const gastosActualizados = gastos.filter(gasto => gasto.id !== id)

  setGastos(gastosActualizados)
} 

//prueba git
  return (
    <div className={modal?'fijar':''}>
        <Header

        setGastos={setGastos}
        gastos={gastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
        />

        {isValidPresupuesto && (
          <>
          
          <main>
            <Filtros
            filtro={filtro}
            setFiltro={setFiltro}
            />
            <ListadoGastos
            gastosFiltrados={gastosFiltrados}
            filtro={filtro}
            gastos={gastos}
            setGastoEditar={setGastoEditar}
            eliminarGasto={eliminarGasto}
            />
          </main>
          <div className='nuevo-gasto'>
          <img src={IconoNuevoGasto} 
          alt='icono nuevo gasto'
          onClick={handleNuevoGasto}/>
        </div>
        </>
        )}

        {modal && <Modal 
        setModal={setModal}
        animarModal={animarModal}
        setAnimarModal={setAnimarModal}
        guardarGasto={guardarGasto}
        gastoEditar={gastoEditar}
        setGastoEditar={setGastoEditar}
        />}
        
    </div>
  )
}

export default App
