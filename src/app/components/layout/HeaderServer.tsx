import { logout, getUserDisplayName } from "@/app/app/actions/auth";  

export default async function HeaderServer() {
    const result = await getUserDisplayName();

  return (
    <header className="sticky w-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 z-40 top-0 start-0 border-b border-blue-gray-ghost backdrop-blur-md">
        <div className="font-mono font-extralight mx-auto py-3 flex items-center justify-between">
            <div> show-off</div>
            <div> Welcome, {result.data} </div>
            <form action={logout}>
                <button type="submit" className="hover:underline cursor-pointer">
                    Logout
                </button>
            </form>
        </div>
    </header>
  );
}