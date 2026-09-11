export interface ServiceDetail {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  highlights: string[];
  vehicleOptions: string[];
  pricingNote: string;
  badge: string;
}

export const PUBLIC_SERVICES: ServiceDetail[] = [
  {
    id: 've-limousine',
    title: 'Vé Xe Ghép Limousine VIP',
    badge: 'Chạy Hàng Ngày',
    shortDesc: 'Tuyến Quảng Ninh ⇄ Hải Phòng ⇄ Thái Bình ⇄ Nam Định ⇄ Ninh Bình và ngược lại.',
    fullDesc:
      'Dịch vụ xe Limousine cao cấp chạy liên tục từ sáng sớm đến tối muộn. Ghế thương gia ngả lưng 180 độ có massage thư giãn, sạc điện thoại tại từng ghế, wifi tốc độ cao và phục vụ khăn lạnh, nước suối miễn phí suốt hành trình.',
    highlights: [
      'Đón trả tận nơi tại nội thành và các điểm đón trung tâm',
      'Cam kết xuất bến đúng giờ, không bắt khách dọc đường',
      'Xe chạy 100% đường cao tốc êm ái, tiết kiệm tối đa thời gian',
      'Mỗi hành khách 1 ghế riêng biệt, không nhồi nhét',
    ],
    vehicleOptions: ['Limousine 11 chỗ DCar President', 'Solati Limousine 16 chỗ'],
    pricingNote: 'Giá vé niêm yết rõ ràng theo từng chặng, liên hệ tổng đài để nhận báo giá chính xác.',
  },
  {
    id: 'thue-xe-hop-dong',
    title: 'Thuê Xe Hợp Đồng 5 - 29 Chỗ',
    badge: 'Riêng Tư & Linh Hoạt',
    shortDesc: 'Phục vụ gia đình, đám cưới, sự kiện, công tác, đón tiễn sân bay Nội Bài, Cát Bi, Vân Đồn.',
    fullDesc:
      'Cung cấp đầy đủ các dòng xe từ 5 chỗ, 7 chỗ, 11 chỗ, 16 chỗ đến 29 chỗ đời mới. Lộ trình và thời gian hoàn toàn do quý khách chủ động sắp xếp. Đội ngũ lái xe giàu kinh nghiệm, lịch sự, chu đáo và am hiểu cung đường.',
    highlights: [
      'Chủ động 100% về thời gian xuất phát và điểm dừng nghỉ',
      'Đa dạng các dòng xe đời mới: Sedan, Carnival, Limousine, Universe',
      'Xe sạch sẽ, bảo dưỡng định kỳ, không mùi say xe',
      'Hợp đồng vận chuyển minh bạch, có hóa đơn VAT khi có yêu cầu',
    ],
    vehicleOptions: ['Xe 5 chỗ', 'Xe 7 chỗ MPV', 'Limousine 11 chỗ', 'Transit 16 chỗ', 'Universe 29 chỗ'],
    pricingNote: 'Báo giá theo lịch trình di chuyển và số ngày thuê, cam kết không phát sinh chi phí.',
  },
  {
    id: 'gui-hang-hoa',
    title: 'Nhận Gửi Hàng Hóa Hỏa Tốc',
    badge: 'Giao Trong Ngày',
    shortDesc: 'Vận chuyển giấy tờ, tài liệu, bưu phẩm, hàng hóa và hải sản tươi sống bảo quản lạnh.',
    fullDesc:
      'Nhận chuyển phát hỏa tốc bưu kiện, tài liệu quan trọng và thực phẩm hải sản giữa Quảng Ninh, Hải Phòng, Thái Bình, Nam Định, Ninh Bình. Hàng hóa được xếp cẩn thận tại khoang hành lý riêng biệt, đảm bảo an toàn tuyệt đối.',
    highlights: [
      'Thời gian giao nhận siêu tốc chỉ từ 2 đến 4 tiếng',
      'Cung cấp mã vận đơn (HG...) giúp theo dõi tình trạng đơn hàng',
      'Hỗ trợ nhận và giao hàng tại các văn phòng dọc tuyến xe',
      'Đảm bảo nguyên vẹn 100% kiện hàng khi đến tay người nhận',
    ],
    vehicleOptions: ['Khoang hành lý xe Limousine chuyên dụng'],
    pricingNote: 'Cước phí tính theo loại hàng, thể tích và khối lượng thực tế.',
  },
  {
    id: 'xe-du-lich',
    title: 'Xe Đi Các Khu Du Lịch',
    badge: 'Trọn Gói Tour',
    shortDesc: 'Đón tiễn các điểm danh thắng nổi tiếng: Vịnh Hạ Long, Cát Bà, Tam Chúc, Tràng An, Bái Đính.',
    fullDesc:
      'Chuyên tour du lịch kết hợp giữa vùng biển Quảng Ninh và vùng đất cố đô Ninh Bình. Xe đưa đón tận sảnh khách sạn, resort, bến tàu du lịch. Lái xe tận tình, có thể hỗ trợ thông tin điểm tham quan, ẩm thực địa phương.',
    highlights: [
      'Kết nối trực tiếp Hạ Long - Cát Bà - Tam Chúc - Tràng An',
      'Xe phục vụ cả chuyến đi và chuyến về theo lịch trình tham quan',
      'Khoang hành lý rộng rãi, thoải mái chứa vali cỡ lớn',
      'Ưu đãi đặc biệt cho đoàn gia đình và nhóm du khách đông người',
    ],
    vehicleOptions: ['Limousine 11 chỗ VIP', 'Xe 7 chỗ MPV', 'Xe 16 - 29 chỗ đoàn đông'],
    pricingNote: 'Gói dịch vụ tính theo chuyến 1 chiều hoặc trọn gói khứ hồi nhiều ngày.',
  },
];

export const SERVICE_COMMITMENTS = [
  {
    title: 'Giữ Chỗ Đã Đặt',
    description: 'Hành khách đặt vé trước luôn được sắp xếp đúng vị trí ghế thỏa thuận, tuyệt đối không hủy chuyến tùy tiện.',
  },
  {
    title: 'Đúng Giờ Xuất Bến',
    description: 'Xe khởi hành đúng khung giờ đã thông báo, đảm bảo lộ trình công việc và lịch trình của quý khách.',
  },
  {
    title: 'Đón Trả Tận Nơi',
    description: 'Hỗ trợ đưa đón tận nhà, khách sạn tại các khu vực trung tâm các tỉnh thành theo cam kết phục vụ.',
  },
  {
    title: 'Minh Bạch Giá Cước',
    description: 'Mọi thông tin giá vé, cước gửi hàng đều được thông báo rõ ràng trước chuyến đi, không thu thêm phí bất hợp lý.',
  },
  {
    title: 'Lắng Nghe & Xử Lý Khiếu Nại',
    description: 'Tổng đài tiếp nhận và giải quyết thỏa đáng 100% các phản hồi đóng góp ý kiến để không ngừng nâng cao chất lượng.',
  },
  {
    title: 'Lái Xe Văn Minh, An Toàn',
    description: 'Đội ngũ bác tài được đào tạo chuyên nghiệp, lái xe điềm đạm, tuân thủ luật giao thông và không hút thuốc trên xe.',
  },
];

export const FAQ_ITEMS = [
  {
    q: 'Xe đón trả tại những khu vực nào?',
    a: 'Xe Limousine hỗ trợ đón và trả khách tận nơi tại nội thành TP Hạ Long, Cẩm Phả, Uông Bí (Quảng Ninh), nội thành Hải Phòng, TP Thái Bình, TP Nam Định, TP Ninh Bình và các điểm du lịch lớn như Tuần Châu, Tràng An, Tam Cốc.',
  },
  {
    q: 'Tôi có cần đặt cọc trước khi đi xe không?',
    a: 'Đối với vé xe ghép ngày thường, quý khách chỉ cần đăng ký giữ chỗ và thanh toán khi lên xe. Đối với vé ngày lễ Tết hoặc thuê xe hợp đồng trọn chuyến, nhà xe có thể yêu cầu đặt cọc một phần để bảo lưu lịch trình xe.',
  },
  {
    q: 'Trẻ em đi cùng có cần mua vé riêng không?',
    a: 'Trẻ em dưới 5 tuổi ngồi chung ghế với bố mẹ được miễn phí vé. Trẻ em từ 5 tuổi trở lên hoặc cần ngồi ghế riêng biệt tính bằng giá vé người lớn để đảm bảo an toàn và tiện nghi tốt nhất.',
  },
  {
    q: 'Làm thế nào để gửi hàng hóa và nhận hàng?',
    a: 'Quý khách có thể mang hàng ra điểm hẹn hoặc văn phòng nhà xe. Sau khi tiếp nhận, hệ thống cung cấp mã vận đơn (HG...) để người gửi và người nhận dễ dàng kiểm tra trạng thái trên website.',
  },
];
