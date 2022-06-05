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
				</div>
			</div>
	);
}

export default Footer;
