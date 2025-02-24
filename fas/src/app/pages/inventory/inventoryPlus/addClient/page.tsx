'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

interface Client {
    id: number;
    name: string;
}

export default function MedicinesPage() {
    const [clientName, setClientName] = useState("");
    const [clients, setClients] = useState<Client[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const API_URL = "http://172.20.10.2:5000/Client";


    // Fetch clients on component mount
    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get(API_URL);
            setClients(response.data);
        } catch (error) {
            console.error("Error fetching clients:", error);
        }
    };

    const handleAdd = async () => {
        if (clientName.trim()) {
            try {
                const newClient = {
                    name: clientName.trim()
                };
                await axios.post(API_URL, newClient);
                setClientName("");
                fetchClients(); // Refresh the list
            } catch (error) {
                console.error("Error adding client:", error);
            }
        }
    };

    const handleRemove = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchClients(); // Refresh the list
        } catch (error) {
            console.error("Error removing client:", error);
        }
    };

    const handleEdit = (client: Client) => {
        setEditingId(client.id);
        setClientName(client.name);
    };

    const handleUpdate = async () => {
        if (editingId !== null && clientName.trim()) {
            try {
                await axios.put(`${API_URL}/${editingId}`, {
                    id: editingId,
                    name: clientName.trim()
                });
                setClientName("");
                setEditingId(null);
                fetchClients(); // Refresh the list
            } catch (error) {
                console.error("Error updating client:", error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-screen h-[80vh] p-6">
            <div className="absolute top-4 right-4">
                <Link href="/pages/inventory/inventoryPlus/">
                    <Image src="/back-button.png" width={32} height={32} alt="back-button" />
                </Link>
            </div>
            <h1 className="text-2xl font-bold mb-4">Добавить клиент</h1>

            <div className="flex flex-col justify-center items-end space-y-2 mb-4">
                <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="border-[#0D1633] border-2 rounded-lg text-xl w-full p-2 font-semibold"
                    placeholder="Введите название..."
                />
                {editingId === null ? (
                    <button
                        onClick={handleAdd}
                        className="border-[#0D1633] bg-[#0D1633] border-2 rounded-lg text-white text-sm w-1/3"
                    >
                        добавить
                    </button>
                ) : (
                    <button
                        onClick={handleUpdate}
                        className="border-[#0D1633] bg-[#0D1633] border-2 rounded-lg text-white text-sm w-1/3"
                    >
                        обновить
                    </button>
                )}
            </div>

            <p className="mb-2">Количество клиентов: {clients.length}</p>

            <ul className="list-decimal list-inside w-full max-w-md">
                {clients.map((client) => (
                    <li
                        key={client.id}
                        className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded"
                    >
                        <span className="mr-4 text-xl font-semibold">{client.name}</span>
                        <div className="space-x-2">
                            <button onClick={() => handleEdit(client)}>
                                <Image src="/edit.png" width={32} height={32} alt="edit" />
                            </button>
                            <button onClick={() => handleRemove(client.id)}>
                                <Image src="/delete.png" width={32} height={32} alt="delete" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}