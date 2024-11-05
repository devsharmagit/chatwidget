'use client';
import { signOut, useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import {  useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';
import { navbarItems } from '@/lib/constants/navbar.constant';
export const CompanyLogo = () => {
  return (
    <div 
      className="flex items-center gap-2 cursor-pointer"
    >
      {/* TODO: goat image */}
      {/* <Image
        src={'/main.svg'}
        alt="100xJobs logo"
        width={30}
        height={30}
        className="rounded"
      /> */}
      <h3 className="text-2xl font-bold">
        Chat<span className="text-rose-500">Goat</span>
      </h3>
    </div>
  );
};

const Navbar = () => {
  const session = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
 



  return (
    <>
      <nav className="fixed w-full z-50 backdrop-blur-lg border">
        <div className="flex h-[72px] w-full items-center justify-between lg:px-20 px-3 shadow-sm">
          <Link href="/" className="p-2.5">
            <CompanyLogo />
          </Link>
          <div className="flex items-center">
            <ul className="md:flex items-center gap-4 text-sm lg:gap-6 hidden mx-4">
              {session.status === 'loading'
                && new Array(5).map((_ : any, index : any) => (
                    <Skeleton className="h-4 w-[60px]" key={index} />
                  ))
                }
                {session.status !== "loading" && navbarItems.map((item)=> <Link key={item.id} href={item.path}> {item.label} </Link>)}
            </ul>
           
            <div className="hidden md:block">
              {session.status === 'loading' ? (
                <Skeleton className="h-8 w-8 rounded-full" />
              ) : session.status === 'authenticated' ? (
                <>
                  <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                        aria-label="avatar"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {(session.data.user.email)[0]}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuItem>
                        <UserRound className="mr-2 h-4 w-4" />
                        <Link
                          className="w-full"
                          href={'/profile/' + session.data.user.id}
                        >
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          signOut();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div>
                  <Button
                    className="rounded-lg"
                    size="sm"
                    variant="default"
                    onClick={() => {
                      router.push('/signin');
                    }}
                    aria-label="login"
                  >
                    Login
                  </Button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
      <div className="h-[72px] print:hidden"></div>
    </>
  );
};

export default Navbar;
