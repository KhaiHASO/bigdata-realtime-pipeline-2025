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
    <div className="space-y-8 animate-[fadein_0.25s_ease]">
      <div>
        <h1 className="text-3xl font-semibold mb-2 text-slate-900 tracking-tight">Bảng Điều Khiển MongoDB (Mô Phỏng)</h1>
        <p className="text-slate-500 tracking-tight">
          Lưu trữ dữ liệu đã xử lý và các aggregation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 tracking-tight">
              <Clock className="h-4 w-4" />
              Cập nhật lần cuối: {lastUpdate.toLocaleTimeString()}
            </div>
            <div className="h-96 overflow-y-auto border border-white/40 rounded-2xl bg-white/60 backdrop-blur-xl">
              <table className="w-full text-sm">
                <thead className="bg-white/70 backdrop-blur-xl sticky top-0 border-b border-white/40">
                  <tr>
                    <th className="p-3 text-left text-slate-900 font-semibold tracking-tight">ID</th>
                    <th className="p-3 text-left text-slate-900 font-semibold tracking-tight">Tên</th>
                    <th className="p-3 text-left text-slate-900 font-semibold tracking-tight">Danh Mục</th>
                    <th className="p-3 text-left text-slate-900 font-semibold tracking-tight">Số Tiền</th>
                    <th className="p-3 text-left text-slate-900 font-semibold tracking-tight">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-500 tracking-tight">
                        Chưa có bản ghi nào. Bắt đầu mô phỏng.
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record._id} className="border-b border-white/40 hover:bg-white/50 transition-colors">
                        <td className="p-3 font-mono text-xs text-slate-900">{record._id.slice(0, 8)}...</td>
                        <td className="p-3 text-slate-900">{record.name}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-[#0A84FF]/10 text-[#0A84FF] rounded-lg text-xs font-medium">
                            {record.category}
                          </span>
                        </td>
                        <td className="p-3 text-slate-900 font-medium">${record.amount}</td>
                        <td className="p-3">
                          {record.processed ? (
                            <span className="text-[#0A84FF] text-xs font-medium">✓ Đã Xử Lý</span>
                          ) : (
                            <span className="text-[#FF9500] text-xs font-medium">Đang Chờ</span>
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
                <div className="text-center text-slate-500 py-8 tracking-tight">
                  Chưa có aggregation nào. Bắt đầu mô phỏng.
                </div>
              ) : (
                aggregations.map((agg) => (
                  <div key={agg.category} className="p-4 bg-white/40 backdrop-blur-xl border border-white/40 rounded-xl hover:bg-white/50 hover:translate-y-[-2px] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize text-slate-900">{agg.category}</span>
                      <span className="text-sm text-slate-500 tracking-tight">
                        {agg.count} bản ghi
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-500 tracking-tight">Tổng Số Tiền</span>
                      <span className="font-bold text-slate-900">${agg.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 w-full bg-white/40 rounded-full h-2">
                      <div
                        className="bg-[#0A84FF] h-2 rounded-full transition-all duration-300"
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
