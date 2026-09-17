import { useAuth } from "../hooks/userAuth"

function ChatPage(){
    const {user} = useAuth()
    return (
        <div>
            Welcome {user.name}
        </div>
    )
}

export default ChatPage