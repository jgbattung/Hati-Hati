import React from 'react'

interface InvitationEmailProps {
  inviterName: string;
  inviteLink: string;
}

const InvitationEmail: React.FC<Readonly<InvitationEmailProps>> = ({
  inviterName,
  inviteLink,
}) => {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
    }}>
      <div style={{
        background: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center' as const,
      }}>
        <h1 style={{
          color: '#333',
          marginBottom: '20px',
        }}>
          Join Hati-hati!
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#555',
          marginBottom: '24px',
          lineHeight: '1.5',
        }}>
          Hey there!
        </p>

        <p style={{
          fontSize: '16px',
          color: '#555',
          marginBottom: '24px',
          lineHeight: '1.5',
        }}>
          {inviterName} has invited you to join Hati-hati, an expense sharing app that makes it easy to split bills and track shared expenses.
        </p>

        <a
          href={inviteLink}
          style={{
            display: 'inline-block',
            background: '#0070f3',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '4px',
            textDecoration: 'none',
            marginBottom: '24px',
          }}
        >
          Accept Invitation
        </a>

        <p style={{
          fontSize: '14px',
          color: '#777',
          marginTop: '24px',
        }}>
          {`This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.`}
        </p>

        <div style={{
          marginTop: '32px',
          borderTop: '1px solid #eee',
          paddingTop: '16px',
          fontSize: '12px',
          color: '#999',
        }}>
          © {new Date().getFullYear()} Hati-hati. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default InvitationEmail