import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useKafkaMessages } from '@/hooks/useSimulationData';
import { simulationDataService } from '@/services/simulationDataService';
import { MessageSquare, Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export const KafkaUI = () => {
  const messages = useKafkaMessages();
  const [topics] = useState(['users', 'transactions', 'events', 'logs']);
  const [consumerGroups] = useState(['spark-consumer', 'flink-consumer', 'analytics-consumer']);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePushMessage = () => {
    simulationDataService.pushKafkaMessage();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Giao Diện Kafka (Mô Phỏng)</h1>
        <p className="text-muted-foreground">
          Luồng tin nhắn thời gian thực từ các Kafka topics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Topics</CardTitle>
            <CardDescription>Các Kafka topics có sẵn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topics.map((topic) => (
                <div key={topic} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="font-mono text-sm">{topic}</span>
                  <span className="text-xs text-muted-foreground">
                    {messages.filter(m => m.topic === topic).length} tin nhắn
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consumer Groups</CardTitle>
            <CardDescription>Các consumer groups đang hoạt động</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {consumerGroups.map((group) => (
                <div key={group} className="p-2 bg-muted rounded">
                  <span className="font-mono text-sm">{group}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thao Tác</CardTitle>
            <CardDescription>Tạo tin nhắn thủ công</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handlePushMessage} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Gửi Tin Nhắn Ngẫu Nhiên
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Luồng Tin Nhắn
          </CardTitle>
          <CardDescription>
            Tin nhắn thời gian thực cuộn (cập nhật mỗi 1-2 giây)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-y-auto space-y-2 border rounded-lg p-4 bg-muted/50">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Chưa có tin nhắn nào. Bắt đầu mô phỏng để xem tin nhắn.
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className="p-3 bg-background border rounded-md hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {message.topic}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        P:{message.partition} O:{message.offset}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(message.value, null, 2)}
                  </pre>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
