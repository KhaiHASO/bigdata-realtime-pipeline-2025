import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMongoRecords, useAggregations } from '@/hooks/useSimulationData';
import { simulationDataService } from '@/services/simulationDataService';
import { Database, Plus, Clock } from 'lucide-react';
import { useState } from 'react';

export const MongoDBUI = () => {
  const records = useMongoRecords();
  const aggregations = useAggregations();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const handleInsertRecord = () => {
    simulationDataService.insertMongoRecord();
    setLastUpdate(new Date());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bảng Điều Khiển MongoDB (Mô Phỏng)</h1>
        <p className="text-muted-foreground">
          Lưu trữ dữ liệu đã xử lý và các aggregation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Bản Ghi Dữ Liệu
            </CardTitle>
            <CardDescription>
              Các bản ghi đã xử lý được lưu trữ trong MongoDB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button onClick={handleInsertRecord} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Thêm Bản Ghi Ngẫu Nhiên
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Clock className="h-4 w-4" />
              Cập nhật lần cuối: {lastUpdate.toLocaleTimeString()}
            </div>
            <div className="h-96 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Tên</th>
                    <th className="p-2 text-left">Danh Mục</th>
                    <th className="p-2 text-left">Số Tiền</th>
                    <th className="p-2 text-left">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        Chưa có bản ghi nào. Bắt đầu mô phỏng.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record._id} className="border-b hover:bg-accent">
                        <td className="p-2 font-mono text-xs">{record._id.slice(0, 8)}...</td>
                        <td className="p-2">{record.name}</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            {record.category}
                          </span>
                        </td>
                        <td className="p-2">${record.amount}</td>
                        <td className="p-2">
                          {record.processed ? (
                            <span className="text-green-600 text-xs">✓ Đã Xử Lý</span>
                          ) : (
                            <span className="text-yellow-600 text-xs">Đang Chờ</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Các Aggregation</CardTitle>
            <CardDescription>
              Aggregation dữ liệu theo danh mục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aggregations.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Chưa có aggregation nào. Bắt đầu mô phỏng.
                </div>
              ) : (
                aggregations.map((agg) => (
                  <div key={agg.category} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{agg.category}</span>
                      <span className="text-sm text-muted-foreground">
                        {agg.count} bản ghi
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tổng Số Tiền</span>
                      <span className="font-bold">${agg.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(agg.count / 1000) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
