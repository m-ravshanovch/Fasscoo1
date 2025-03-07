'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

interface Medicine {
    id: number;
    name: string;
}

export default function MedicinesPage() {
    const [medicineName, setMedicineName] = useState("");
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const API_URL = "https://medicine-store.fassco.uz/api/v1/accounting/medicines/";

    // Fetch medicines on component mount
    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log(response.data); // Log the response to inspect its structure
    
            // If the response data is an object that contains the medicines array
            const medicinesData = Array.isArray(response.data) ? response.data : response.data.medicines || [];
            
            setMedicines(medicinesData);
        } catch (error) {
            console.error("Error fetching medicines:", error);
        }
    };
    

    const handleAdd = async () => {
        if (medicineName.trim()) {
            try {
                const newMedicine = {
                    name: medicineName.trim()
                };
                await axios.post(API_URL, newMedicine);
                setMedicineName("");
                fetchMedicines(); // Refresh the list
            } catch (error) {
                console.error("Error adding medicine:", error);
            }
        }
    };

    const handleRemove = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchMedicines(); // Refresh the list
        } catch (error) {
            console.error("Error removing medicine:", error);
        }
    };

    const handleEdit = (medicine: Medicine) => {
        setEditingId(medicine.id);
        setMedicineName(medicine.name);
    };

    const handleUpdate = async () => {
        if (editingId !== null && medicineName.trim()) {
            try {
                await axios.put(`${API_URL}/${editingId}`, {
                    id: editingId,
                    name: medicineName.trim()
                });
                setMedicineName("");
                setEditingId(null);
                fetchMedicines(); // Refresh the list
            } catch (error) {
                console.error("Error updating medicine:", error);
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
            <h1 className="text-2xl font-bold mb-4">Добавить лекарство</h1>

            <div className="flex flex-col justify-center items-end space-y-2 mb-4">
                <input
                    type="text"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
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

            <p className="mb-2">Количество лекарств: {medicines.length}</p>

            <ul className="list-decimal list-inside w-full max-w-md">
                {medicines.map((medicine) => (
                    <li
                        key={medicine.id}
                        className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded"
                    >
                        <span className="mr-4 text-xl font-semibold">{medicine.name}</span>
                        <div className="space-x-2">
                            <button onClick={() => handleEdit(medicine)}>
                                <Image src="/edit.png" width={32} height={32} alt="edit" />
                            </button>
                            <button onClick={() => handleRemove(medicine.id)}>
                                <Image src="/delete.png" width={32} height={32} alt="delete" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}