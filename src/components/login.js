import Button from "./button";
import Messages from "./messages";

const Login = () => {
    const on_click = () => {

    }

    return(
        <>
        <div className='header'>
            <h1 style={header_style}>
                learning react
            </h1>
            <Button text='Kill alirezaee in moment' color='navy' onClick={on_click} />
        </div>
        <body>
            <Messages messages={[{text:'کصمادر علیرضایی'}, {text:'کص ننه علیرضایی'}, {text: 'دختر علیرضاییو گاییدم'}]}/>
        </body>
        </>

        )
}

const header_style = {
    color:'purple'
}
export default Login