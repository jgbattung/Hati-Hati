'use client'

import { acceptInvitation } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs"
import { useEffect } from "react";

const InvitationHandler = () => {
  const { user } = useUser();

  useEffect(() => {
    const handleInvitation = async () => {
      // Check for invitation data in sessionStorage
      const inviteDataString = sessionStorage.getItem('inviteData');
      if (!inviteDataString || !user) return;

      try {
        const inviteData = JSON.parse(inviteDataString);

        // Call the server action to handle invitation
        const result = await acceptInvitation({
          id: user.id,
          name: user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName
          || null,
          inviteToken: inviteData.token,
        });

        if (result.success) {
          // Clean up sessionStorage
          sessionStorage.removeItem('inviteData');
        } else {
          console.error('Failed to process invitaion: ', result.error)
        }
      } catch (error) {
        console.error('Error handling invitation: ', error);
      }
    }

    handleInvitation();
  }, [user]);

  return null
}

export default InvitationHandler