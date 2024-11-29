import { OnboardingPage } from '@/components/Onboarding/OnboardingPage';

import { CurrentProfile } from '@/lib/current-profile';

import { redirectToSignIn } from '@clerk/nextjs';

const UserOnboardingPage = async () => {
    const profile = await CurrentProfile();
  if(!profile)return redirectToSignIn();
  return (
    <OnboardingPage name={profile?.name}/>
  )
}
export default UserOnboardingPage