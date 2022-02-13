const Persons = ({persons, deleteCallback}) => {
    return (
        <>
          {
            persons.map(p => 
              <p key={p.name}>
                {p.name} {p.number} 
                <button onClick={deleteCallback} id={p.id}>Delete</button>
              </p>
            )
          }
        </>
    );
}

export default Persons