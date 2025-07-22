import React from 'react';
import { Card, Typography, Alert } from 'antd';

const { Text, Title } = Typography;

const DebugInfo = ({ user, ingredientsError, mealsError, ingredientsLoading, mealsLoading }) => {
  return (
    <Card title="🔍 Debug Information" style={{ marginBottom: 16, backgroundColor: '#f5f5f5' }}>
      <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
        <Title level={5}>👤 User Authentication:</Title>
        <Text>User ID: {user?.id || 'NULL'}</Text><br />
        <Text>Email: {user?.email || 'NULL'}</Text><br />
        <Text>Provider: {user?.app_metadata?.provider || 'NULL'}</Text><br />
        <Text>Created: {user?.created_at || 'NULL'}</Text><br />
        <br />
        
        <Title level={5}>📊 Data Loading Status:</Title>
        <Text>Ingredients Loading: {ingredientsLoading ? 'YES' : 'NO'}</Text><br />
        <Text>Meals Loading: {mealsLoading ? 'YES' : 'NO'}</Text><br />
        <br />
        
        <Title level={5}>❌ Error Information:</Title>
        <Text>Ingredients Error: {ingredientsError || 'NONE'}</Text><br />
        <Text>Meals Error: {mealsError || 'NONE'}</Text><br />
        <br />
        
        <Title level={5}>🔍 Error Analysis:</Title>
        {ingredientsError && (
          <Alert
            message="Ingredients Error Details"
            description={
              <div>
                <Text>Error: {ingredientsError}</Text><br />
                <Text>Contains 'does not exist': {ingredientsError.includes('does not exist') ? 'YES' : 'NO'}</Text><br />
                <Text>Error Type: {typeof ingredientsError}</Text>
              </div>
            }
            type="error"
            style={{ marginBottom: 8 }}
          />
        )}
        
        {mealsError && (
          <Alert
            message="Meals Error Details"
            description={
              <div>
                <Text>Error: {mealsError}</Text><br />
                <Text>Contains 'does not exist': {mealsError.includes('does not exist') ? 'YES' : 'NO'}</Text><br />
                <Text>Error Type: {typeof mealsError}</Text>
              </div>
            }
            type="error"
            style={{ marginBottom: 8 }}
          />
        )}
        
        {!ingredientsError && !mealsError && (
          <Alert
            message="No Errors Found"
            description="Both ingredients and meals queries are working correctly."
            type="success"
          />
        )}
      </div>
    </Card>
  );
};

export default DebugInfo; 