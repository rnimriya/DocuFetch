import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface DocumentUploadedEmailProps {
  clientName: string
  documentName: string
  requestTitle: string
  dashboardUrl: string
}

export function DocumentUploadedEmail({
  clientName,
  documentName,
  requestTitle,
  dashboardUrl,
}: DocumentUploadedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{clientName} uploaded "{documentName}"</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px' }}>
          <Heading style={{ fontSize: '24px', color: '#111827' }}>
            New Document Uploaded
          </Heading>
          <Text style={{ color: '#374151', fontSize: '16px' }}>
            <strong>{clientName}</strong> has uploaded <strong>"{documentName}"</strong>{' '}
            for request: <em>{requestTitle}</em>
          </Text>
          <Button
            href={dashboardUrl}
            style={{
              backgroundColor: '#6366f1',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            Review Document
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
