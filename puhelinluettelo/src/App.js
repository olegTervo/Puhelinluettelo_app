import './index.css'
import { useState, useEffect } from 'react'

import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PhoneNumberService from './services/PhoneNumberService'

const App = () => {
  const AddedText = (name) => `Added ${name}`
  const DeletedText = (name) => `Deleted ${name}`
  const ChangedText = (name) => `Changed ${name}`
  const NotFoundText = (name) => `Information of ${name} have been already removed from the server`
  const Error = (name) => `Error on operation`

  const Added = (name) => {
    setNotification({
      message:AddedText(name), 
      isError:false
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const Deleted = (name) => {
    setNotification({
      message:DeletedText(name), 
      isError:false
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const Changed = (name) => {
    setNotification({
      message:ChangedText(name), 
      isError:false
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const NotFound = (name) => {
    setNotification({
      message:NotFoundText(name), 
      isError:true
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhoneNumber, setNewPhoneNumber] = useState('')
  const [searchState, setSearchState] = useState('')
  const [notification, setNotification] = useState({message: '', isError:false})

  useEffect(() => {
    PhoneNumberService.getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const createRowCallback = (e) => {
    e.preventDefault()

    if (persons.findIndex(p => p.name === newName) == -1) {
      PhoneNumberService.create({name: newName, number: newPhoneNumber})
        .then(response => {
          Added(response.data.name)
          setPersons(persons.concat(response.data))
        })
    }
    else {
      if(window.confirm(`${newName} is already exists. Do you want to update number?`)) {
        const person = persons.find(p => p.name === newName)
        PhoneNumberService.update(person.id, {...person, number: newPhoneNumber})
          .then(({data}) => {
            Changed(data.name)
            const filteredPersons = persons.filter(p => p.name !== data.name)
            setPersons(filteredPersons.concat(data))
          })
      }
    }

    setNewName('')
    setNewPhoneNumber('')
  }

  const personsToShow = searchState.length > 0
    ? persons.filter(p => p.name.toLowerCase().startsWith(searchState.toLowerCase()))
    : persons

  const nameInputCallback = (e) => setNewName(e.target.value)
  const phoneInputCallback = (e) => setNewPhoneNumber(e.target.value)
  const deleteCallback = (e) => {
    const personToDelete = persons.find(p => p.id === Number(e.target.id))

    if(window.confirm(`Are you shure you want to delete ${personToDelete.name}?`))
      PhoneNumberService
        .remove(personToDelete.id)
        .then(res => {
          Deleted(personToDelete.name)
          setPersons(persons.filter(p => p.id !== personToDelete.id))
        })
        .catch(error => {
          NotFound(personToDelete.name)
          setPersons(persons.filter(p => p.id !== personToDelete.id))
      })
  }

  const search = (e) => setSearchState(e.target.value)

  return (
    <div>
      <Notification message={notification.message} isError={notification.isError} />
      <h2>Phonebook</h2>
      <Filter search={search}/>
      <h3>Add a new</h3>
      <PersonForm 
        createCallback={createRowCallback} 
        newName={newName}
        newPhoneNumber={newPhoneNumber}
        nameInputCallback={nameInputCallback} 
        phoneInputCallback={phoneInputCallback}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deleteCallback={deleteCallback}/>
    </div>
  )

}

export default App