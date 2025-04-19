"use client";

import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn,useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  AuthLoading,
  Authenticated,
  ConvexReactClient,
} from "convex/react";
import { Loading } from "@/components/auth/loading";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <SignedIn>
          <Authenticated>
            {children}
          </Authenticated>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        <AuthLoading>
          <Loading />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
