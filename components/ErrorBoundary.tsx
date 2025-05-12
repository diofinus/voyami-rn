import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Pressable, Text, View } from "react-native";

const ErrorBoundaryWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, color: 'red' }}>Something went wrong:</Text>
          <Text>{error.message}</Text>
          <Pressable onPress={resetErrorBoundary}>
            <Text style={{ color: 'blue' }}>Try again</Text>
          </Pressable>
        </View>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundaryWrapper