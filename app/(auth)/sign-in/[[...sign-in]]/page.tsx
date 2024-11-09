import { SignIn } from "@clerk/nextjs";


export default function Page(){
    return (
        <div className="flex items-center justify-center w-1/2 ">
            <SignIn afterSignOutUrl={'/'} />
        </div>
        
    );
}