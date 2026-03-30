import React from 'react'; 

function Component(props) {
    return (
        <h1> Teste</h1>
        {props.nome}
    )
}

export default Component;


<Main>

    <HeaderProjet />

    <Component 
        nome={"Emerson"}

    />

</Main>