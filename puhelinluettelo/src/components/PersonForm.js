const PersonForm = ({createCallback, nameInputCallback, phoneInputCallback, newName, newPhoneNumber}) => {
    return (
      <form>
        <div>
          name: <input onChange={nameInputCallback} value={newName}/> <br/>
          number: <input onChange={phoneInputCallback} value={newPhoneNumber} />
        </div>
        <div>
          <button type="submit" onClick={createCallback}>add</button>
        </div>
      </form>
    );
}

export default PersonForm