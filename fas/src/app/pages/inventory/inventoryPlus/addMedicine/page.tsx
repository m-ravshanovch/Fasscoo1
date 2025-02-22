import Image from "next/image"
import Link from "next/link"

export default function Home() {
    return (
        <div className="flex flex-col justify-center items-start w-screen h-[80vh]">
            <div>
                <button type="button" className="absolute top-0 right-0 m-4">
                    <Link href="/pages/inventory/inventoryPlus/">
                        <Image src="/back-button.png" width={32} height={32} alt="back-button"></Image>
                    </Link>
                </button>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
                <h2 className="font-bold mt-4 lg:text-xl">Добавить лекарство</h2>
                <form className="flex flex-col justify-center items-end">
                    <input type="text" className="border-[#0D1633] border-2 rounded-lg text-xl w-full p-2" />
                    <button type="submit" className="border-[#0D1633] bg-[#0D1633] border-2 rounded-lg text-white text-xl mt-2">добавить</button>
                </form>
            </div>
            <div>
                <h3>Количество лекарств:</h3>
            </div>
        </div>
    )
}