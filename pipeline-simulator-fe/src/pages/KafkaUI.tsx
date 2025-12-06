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
    <div className="space-y-8 animate-\[fadein_0.25s_ease\]">
      <div>
        <h1 className="text-3xl font-semibold mb-2 text-[#0A0A0A] tracking-tight">Giao Diện Kafka (Mô Phỏng)</h1>
        <p className="text-[#6B7280] tracking-tight">
          Luồng tin nhắn thời gian thực từ các Kafka topics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Topics</CardTitle>
            <CardDescription>Các Kafka topics có sẵn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topics.map((topic) => (
                <div key={topic} className="flex items-center justify-between p-3 glass border border-white/40 rounded-xl hover:bg-white/40 transition-all">
                  <span className="font-mono text-sm text-[#0A0A0A]">{topic}</span>
                  <span className="text-xs text-[#6B7280]">
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
                <div key={group} className="p-3 glass border border-white/40 rounded-xl hover:bg-white/40 transition-all">
                  <span className="font-mono text-sm text-[#0A0A0A]">{group}</span>
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
          <div className="h-96 overflow-y-auto space-y-2 border border-white/40 rounded-2xl p-4 glass">
            {messages.length === 0 ? (
              <div className="text-center text-[#6B7280] py-8 tracking-tight">
                Chưa có tin nhắn nào. Bắt đầu mô phỏng để xem tin nhắn.
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className="p-3 glass border border-white/40 rounded-xl hover:bg-white/40 hover:translate-y-[-2px] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#6B7280]">
                        {message.topic}
                      </span>
                      <span className="text-xs text-[#6B7280]">
                        P:{message.partition} O:{message.offset}
                      </span>
                    </div>
                    <span className="text-xs text-[#6B7280]">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs glass border border-white/40 p-2 rounded-lg overflow-x-auto text-[#0A0A0A]">
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
