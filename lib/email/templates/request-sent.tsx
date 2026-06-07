import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface RequestSentEmailProps {
  clientName: string
  workspaceName: string
  requestTitle: string
  itemCount: number
  dueDate?: string
  portalUrl: string
}

export function RequestSentEmail({
  clientName,
  workspaceName,
  requestTitle,
  itemCount,
  dueDate,
  portalUrl,
}: RequestSentEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {workspaceName} has requested {String(itemCount)} document{itemCount !== 1 ? 's' : ''} from you
      </Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px' }}>
          <Heading style={{ fontSize: '24px', color: '#111827', marginBottom: '8px' }}>
            Document Request from {workspaceName}
          </Heading>
          <Text style={{ color: '#6b7280', fontSize: '16px' }}>
            Hello {clientName},
          </Text>
          <Text style={{ color: '#374151', fontSize: '16px' }}>
            {workspaceName} is requesting <strong>{itemCount} document{itemCount !== 1 ? 's' : ''}</strong> from you
            for: <strong>{requestTitle}</strong>
          </Text>
          {dueDate && (
            <Text style={{ color: '#374151', fontSize: '14px' }}>
              Please submit by: <strong>{dueDate}</strong>
            </Text>
          )}
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button
              href={portalUrl}
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
              Upload Documents
            </Button>
          </Section>
          <Text style={{ color: '#9ca3af', fontSize: '13px' }}>
            No account needed — click the button above to securely upload your documents.
          </Text>
          <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0' }} />
          <Text style={{ color: '#9ca3af', fontSize: '12px' }}>
            This request was sent by {workspaceName}. If you believe this was sent in error, please disregard this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
