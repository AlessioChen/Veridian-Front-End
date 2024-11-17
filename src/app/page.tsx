import Image from "next/image";

export default function Component() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-8 py-16">
                <header className="mb-2">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/logo.png"
                            alt="Veridian Logo"
                            width={240}
                            height={80}
                            className="h-auto"
                        />
                    </div>
                </header>

                <main className="relative grid lg:grid-cols-2 gap-8 items-center">

                    <div className="relative space-y-8 z-10">
                        <h1 className="text-4xl md:text-5xl lg:text-8xl font-bold">
                              <span className="bg-gradient-to-r from-emerald-700 to-emerald-500 bg-clip-text text-transparent">
                                Own your Future.
                              </span>
                        </h1>

                        <p className="text-2xl md:text-3xl text-emerald-700 max-w-2xl">
                            Turn your job into a career with personalised coaching and
                            strategic action plans.
                        </p>

                        <button className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 text-white text-xl font-semibold shadow-lg hover:shadow-2xl transition-shadow">
                            Take first step
                        </button>
                    </div>

                    <Image
                        src="/lock.png"
                        alt="lock"
                        width={500}
                        height={100}
                        className="w-full h-full object-cover opacity-50" // Cover background and add opacity
                    />

                </main>
            </div>
        </div>
    );
}
