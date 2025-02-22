import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
    return (
        <div className="flex justify-center items-center h-[80vh] w-screen">
            <button type="button" className="absolute top-0 left-0 m-4">
                <Link href="/pages/inventory/inventoryPlus/">
                    <Image src="/back-button.png" width={48} height={48} alt="back button"></Image>
                </Link>
            </button>
            <div className="flex flex-col items-center justify-center gap-6">
                <button type="button">
                    <Link href="/pages/inventory/inventoryPlus/addMedicine/" className="border-[#0D1633] border-4 rounded-lg font-semibold text-2xl px-4 py-2 w-80 text-center block active:opacity-80">Добавить лекарство</Link>
                </button>
                <button type="button">
                    <Link href="/pages/inventory/inventoryPlus/addClient/" className="border-[#0D1633] border-4 rounded-lg font-semibold text-2xl px-4 py-2 w-80 text-center block active:opacity-80">Добавить клиент</Link>
                </button>
                <button type="button">
                    <Link href="/pages/inventory/inventoryPlus/addPaymentType/" className="border-[#0D1633] border-4 rounded-lg font-semibold text-2xl px-4 py-2 w-80 text-center block active:opacity-80">Добавить тип оплаты</Link>
                </button>
            </div>
        </div>
    )
}
