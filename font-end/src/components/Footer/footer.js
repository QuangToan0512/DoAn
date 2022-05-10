/* eslint-disable */
import React from 'react';
import { Input, Space } from 'antd';
import { AudioOutlined, FacebookOutlined } from '@ant-design/icons';
//style
import './footer.css';
//img
import footer1 from '../../img/footer1.png';
import footer2 from '../../img/payment-logo.png';

//const
const { Search } = Input;

const suffix = (
	<AudioOutlined
		style={{
			fontSize: 16,
			color: '#1890ff',
		}}
	/>
);

const onSearch = (value) => console.log(value);

Footer.propTypes = {};

function Footer(props) {
	return (
		<div style={{ width: '100%', height: '100%', backgroundColor: '#d9f3f4' }}>
			<div className="form_footer">
				<div className="list_footer">
					<div className="list_footer_item">
						<h3>
							<b>THÔNG TIN CÔNG TY</b>
						</h3>
						<ul className="footer_link">
							<li>
								<a href="#">Giới thiệu về Fahasa</a>
							</li>
							<li>
								<a href="#">Hệ thống cửa hàng</a>
							</li>
							<li>
								<a href="#">Liên hệ & góp ý</a>
							</li>
							<li>
								<a href="#">Tuyển dụng </a>
							</li>
						</ul>
					</div>
					<div className="list_footer_item">
						<h3>
							<b>LIÊN HỆ</b>
						</h3>
						<p>Hotline</p>
						<p>
							<a>1900636467</a>(8h - 21h30)
						</p>
						<p>Mail:</p>
						<p>
							<a>cskh@fahasa.com.vn</a>(8h - 21h00)
						</p>
					</div>
						{/*<div>*/}
						{/*	<h3>*/}
						{/*		<b>ĐĂNG KÝ NHẬN TIN KHUYẾN MẠI</b>*/}
						{/*	</h3>*/}
						{/*	<Search*/}
						{/*		placeholder="input search text"*/}
						{/*		allowClear*/}
						{/*		enterButton="Đăng ký"*/}
						{/*		size="large"*/}
						{/*		onSearch={onSearch}*/}
						{/*	/>*/}
						{/*	/!*<div>*!/*/}
						{/*	/!*    <FacebookOutlined />*!/*/}
						{/*	/!*</div>*!/*/}
						{/*</div>*/}
				</div>
				<div>
					<hr />
				</div>
				<div className="footer_end">
					<div className="footer_end_item">
						<p>
							© 2021 Fahasa - 424 Nguyễn Trãi - Thanh Xuân - Hà Nội424 Nguyễn Trãi - Thanh Xuân - Hà Nội
						</p>
					</div>
					{/*<div className="footer_end_item_tow">*/}
					{/*	<div className="footer_end_item_tow_item">*/}
					{/*		<img src={footer2} style={{ width: '228px', height: '30px' }} />*/}
					{/*	</div>*/}
					{/*	<div className="footer_end_item_tow_item">*/}
					{/*		<img src={footer1} style={{ width: '129px', height: '48px' }} />*/}
					{/*	</div>*/}
					{/*</div>*/}
				</div>
			</div>
		</div>
	);
}

export default Footer;
