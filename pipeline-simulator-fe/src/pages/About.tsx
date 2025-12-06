import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Zap, Database, Info } from 'lucide-react';

export const About = () => {
  const technologies = [
    {
      name: 'Kafka',
      icon: MessageSquare,
      description: 'Apache Kafka là một nền tảng streaming sự kiện phân tán có khả năng xử lý hàng nghìn tỷ sự kiện mỗi ngày. Nó hoạt động như một message broker, cho phép các dịch vụ khác nhau giao tiếp không đồng bộ thông qua topics và partitions.',
      color: 'text-green-600',
    },
    {
      name: 'Spark Streaming',
      icon: Zap,
      description: 'Apache Spark Streaming xử lý các luồng dữ liệu thời gian thực. Nó chia dữ liệu thành các batch nhỏ và xử lý chúng bằng engine cốt lõi của Spark, cho phép xử lý stream với throughput cao và khả năng chịu lỗi.',
      color: 'text-yellow-600',
    },
    {
      name: 'MongoDB',
      icon: Database,
      description: 'MongoDB là một cơ sở dữ liệu NoSQL lưu trữ dữ liệu trong các documents linh hoạt, giống JSON. Nó được thiết kế cho khả năng mở rộng và hiệu suất, làm cho nó lý tưởng để lưu trữ dữ liệu streaming đã xử lý.',
      color: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Giới Thiệu Về Mô Phỏng Này</h1>
        <p className="text-muted-foreground">
          Tìm hiểu về các công nghệ và lý do chúng ta sử dụng mô phỏng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Tại Sao Sử Dụng Mô Phỏng?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Ứng dụng frontend này mô phỏng một pipeline xử lý dữ liệu lớn thời gian thực hoàn chỉnh
            sử dụng <strong>dữ liệu mô phỏng</strong> thay vì các thành phần hạ tầng thực tế.
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold">Lợi Ích Của Mô Phỏng:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Không cần setup - không cần Docker, databases, hay cấu hình phức tạp</li>
              <li>Nhẹ - chạy hoàn toàn trong trình duyệt</li>
              <li>Di động - có thể deploy ở bất kỳ đâu (Vercel, Netlify, GitHub Pages)</li>
              <li>Giáo dục - thể hiện rõ ràng các khái niệm pipeline</li>
              <li>Tương tác - người dùng có thể click nút và thấy kết quả ngay lập tức</li>
              <li>Không phụ thuộc - không cần Python, Java, hay các package hệ thống</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Khi Nào Sử Dụng Hạ Tầng Thực Tế:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Học các chi tiết nội bộ hệ thống thực tế</li>
              <li>Kiểm thử hiệu suất và benchmark</li>
              <li>Phát triển production</li>
              <li>Hiểu các thách thức thực tế</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Giải Thích Các Công Nghệ</h2>
        {technologies.map((tech) => {
          const Icon = tech.icon;
          return (
            <Card key={tech.name}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${tech.color}`} />
                  {tech.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tech.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Luồng Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <strong>1. Thu Thập Dữ Liệu:</strong> Dữ liệu được tạo từ nhiều nguồn khác nhau (file CSV, APIs, v.v.)
            </p>
            <p>
              <strong>2. Kafka:</strong> Tin nhắn được publish vào các Kafka topics, nơi chúng được lưu trữ và phân phối
            </p>
            <p>
              <strong>3. Spark Streaming:</strong> Spark đọc từ Kafka, xử lý dữ liệu theo các batch thời gian thực
            </p>
            <p>
              <strong>4. MongoDB:</strong> Dữ liệu đã xử lý được lưu trữ trong MongoDB để truy vấn và phân tích
            </p>
            <p>
              <strong>5. Bảng Điều Khiển:</strong> Phân tích và trực quan hóa cung cấp insights vào dữ liệu
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
