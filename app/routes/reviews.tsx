import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  Rate,
  message,
  Typography,
  Avatar,
  Popconfirm,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  DeleteOutlined,
  CommentOutlined,
  UserOutlined,
  HomeOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { INITIAL_REVIEWS, INITIAL_PROPERTIES, type Review } from '../mock/hotelAdminData';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function ReviewManagementView() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [form] = Form.useForm();

  const handleReplySubmit = (values: any) => {
    if (!selectedReview) return;

    const updated = reviews.map((r) =>
      r.id === selectedReview.id ? { ...r, reply: values.reply } : r
    );
    setReviews(updated);
    message.success(`Đã gửi phản hồi cho khách hàng "${selectedReview.guestName}"!`);
    setSelectedReview(null);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    message.success('Đã xóa nhận xét thành công!');
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesProperty = propertyFilter === 'all' || r.propertyId === propertyFilter;
    const matchesRating =
      ratingFilter === 'all' || Math.floor(r.rating) === parseInt(ratingFilter);
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchText.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchText.toLowerCase());

    return matchesProperty && matchesRating && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-xs">
        <Title level={4} style={{ margin: 0 }}>
          ⭐ Đánh Giá & Nhận Xét
        </Title>
        <Text type="secondary" className="text-xs">
          Lắng nghe phản hồi từ khách hàng, phản hồi đánh giá và cải thiện chất lượng dịch vụ.
        </Text>
      </div>

      {/* Toolbar */}
      <Card className="border-none shadow-sm rounded-xl">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={10}>
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Tìm theo tên khách hoặc nội dung đánh giá..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} sm={7}>
            <Select
              className="w-full"
              value={propertyFilter}
              onChange={(val) => setPropertyFilter(val)}
            >
              <Option value="all">Tất cả cơ sở lưu trú</Option>
              {INITIAL_PROPERTIES.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={7}>
            <Select
              className="w-full"
              value={ratingFilter}
              onChange={(val) => setRatingFilter(val)}
            >
              <Option value="all">Tất cả sao đánh giá</Option>
              <Option value="5">5 Sao (Tuyệt vời)</Option>
              <Option value="4">4 Sao (Rất tốt)</Option>
              <Option value="3">3 Sao (Bình thường)</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((item) => (
          <Card key={item.id} className="border-none shadow-sm rounded-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-3 mb-3">
              <div className="flex items-center gap-3">
                <Avatar src={item.avatar} icon={<UserOutlined />} size="large" />
                <div>
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {item.guestName}
                    <Rate disabled defaultValue={item.rating} className="text-xs" />
                  </div>
                  <div className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-0.5">
                    <HomeOutlined /> {item.propertyName || 'Cơ sở lưu trú'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{item.createdAt}</span>
                <Tooltip title="Phản hồi đánh giá này">
                  <Button
                    type="primary"
                    size="small"
                    icon={<CommentOutlined />}
                    className="bg-blue-600 text-xs"
                    onClick={() => {
                      setSelectedReview(item);
                      form.setFieldsValue({ reply: item.reply || '' });
                    }}
                  >
                    {item.reply ? 'Sửa phản hồi' : 'Phản hồi'}
                  </Button>
                </Tooltip>

                <Popconfirm
                  title="Xóa nhận xét này?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Tooltip title="Xóa">
                    <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                  </Tooltip>
                </Popconfirm>
              </div>
            </div>

            {/* Comment Body */}
            <Paragraph className="text-slate-700 dark:text-slate-300 text-sm mb-3">
              "{item.comment}"
            </Paragraph>

            {/* Admin Reply Block if exists */}
            {item.reply && (
              <div className="bg-blue-50 dark:bg-slate-800/80 p-3 rounded-lg border-l-4 border-blue-500 text-xs">
                <div className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1 mb-1">
                  <CheckCircleOutlined /> Phản hồi từ Ban Quản Lý:
                </div>
                <div className="text-slate-700 dark:text-slate-200">{item.reply}</div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Reply Modal */}
      <Modal
        title={`Phản Hồi Nhận Xét Của: ${selectedReview?.guestName}`}
        open={!!selectedReview}
        onCancel={() => setSelectedReview(null)}
        onOk={() => form.submit()}
        okText="Gửi phản hồi"
        cancelText="Hủy"
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleReplySubmit} className="py-2">
          <Form.Item
            name="reply"
            label="Nội dung phản hồi chính thức từ Admin / Quản lý"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Ví dụ: Cảm ơn bạn đã đóng góp ý kiến. Khách sạn xin ghi nhận..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
