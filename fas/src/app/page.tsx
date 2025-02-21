'use client';

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";


export default function Home() {
    interface User {
        username: string;
        password: string;
    }
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        axios.get("http://192.168.180.86:5000/Login")
            .then((res) => setUsers(res.data))
            .catch((err) => console.error(err));
    }, []);
    const username = users.length > 0 ? users[0].username : '';
    const password = users.length > 0 ? users[0].password : '';

    const router = useRouter();

    const handleRedirect = () => {
        router.push("/pages/inventory");
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const login = form.login.value;
        const pass = form.password.value;
        if (login === username && pass === password) {
            handleRedirect();
        } else {
            alert(username);
            alert(password);
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
                        <label htmlFor="login" className="text-xs text-start w-full">Логин</label>
                        <input type="text" name="login" id="login" className="border-black border-2 rounded-lg text-xl w-full p-2" />
                    </div>
                    <div className="flex flex-col items-center justify-center w-full gap-1">
                        <label htmlFor="password" className="text-xs text-start w-full">Пароль</label>
                        <input type="password" name="password" id="password" className="border-black border-2 rounded-lg text-xl w-full p-2" />
                    </div>
                    <div className="flex flex-col items-center justify-center w-full">
                        <button type="submit" className="border-[#0D1633] bg-[#0D1633] border-2 rounded-lg text-white text-xl w-full mt-4 p-2">Войти</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
