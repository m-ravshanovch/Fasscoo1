'use client';

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const api = "https://medicine-store.fassco.uz/api/v1/users/api/token/"
export default function Home() {
    const [users, setUsers] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const [csrfToken, setCsrfToken] = useState("TPM0W1rgNVC8DUDEooG7vwVVZLbhr1yGRlDTKTEHaL6RP9rw7eFOFvIiLhM6KtQu"); 
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(api, {
                username: users,
                password: password
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',  
                    'X-CSRFTOKEN': csrfToken  
                }
            })
            console.log(response.data)
            if (response.data && response.data.token) {
                router.push("/pages/inventory/");
            } else {
                setError("Invalid credentials")
            }
        } catch (err) {
            setError("Invalid credentials")
            console.error(err);
        }
    }

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center w-full h-full">
            <div className="flex flex-col items-center justify-center">
                <Image src="/fassco-icon.png" alt="Description of image" width={512} height={512} className="w-72 lg:w-96" />
                <h1 className="text-3xl lg:text-6xl font-bold">FASSCO</h1>
                <p className="font-bold mt-4 lg:text-xl">Панель управления складом</p>
            </div>
            <div className="mt-8 lg:mt-24">
                <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full gap-6">
                    <div className="flex flex-col items-center justify-center w-full gap-1">
                        <label htmlFor="login" className="text-xs text-start w-full font-semibold">Логин</label>
                        <input type="text" onChange={e => setUsers(e.target.value)} name="login" id="login" className="border-[#0D1633] border-2 rounded-lg text-xl w-full p-2" />
                    </div>
                    <div className="flex flex-col items-center justify-center w-full gap-1">
                        <label htmlFor="password" className="text-xs text-start w-full font-semibold">Пароль</label>
                        <input type="password" onChange={e => setPassword(e.target.value)} name="password" id="password" className="border-[#0D1633] border-2 rounded-lg text-xl w-full p-2" />
                    </div>
                    <div className="flex flex-col items-center justify-center w-full font-semibold">
                        <button type="submit" className="border-[#0D1633] bg-[#0D1633] border-2 rounded-lg text-white text-xl w-full mt-4 p-2">Войти</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
