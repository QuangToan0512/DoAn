/* eslint-disable */
import React, { useState } from 'react';
import { Input, Layout, Avatar } from 'antd';
import { useHistory } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons';
import MenuAdmin from './menu/MenuAdmin';
import './style.module.scss';
import ContentAdmin from './Content/ContentAdmin';
import useCategoryLogicData from '../../hooks/useCategoryLogicData';
import useProductLogicData from '../../hooks/useProductLogicData';
import useSliderLogicData from '../../hooks/useSliderLogicData';
import useCustomerLogicData from '../../hooks/useCustomerLogicData';
import useUserAdminLogicData from '../../hooks/useUserAdminLogicData';
import useCartLogicData from '../../hooks/useCartLogicData';
import useTransactionData from '../../hooks/useTransactionData';
import { useSelector } from 'react-redux';
import { BASE_URL_IMAGE } from '../../util/TypeApi';
import Style from './style.module.scss';
import TypeCookiesUtil from '../../util/TypeCookies';
import { ContextApp } from '../../context/contextApp';
import styled from 'styled-components';
const { Header, Sider, Content } = Layout;

const objectKey = {
	TRANG_CHU: 'Trang chủ',
	DANH_MUC: 'Danh mục',
	SAN_PHAM: 'Sản phẩm',
	DON_HANG: 'Đơn hàng',
	SLIDER: 'Slider',
	KHACH_HANG: 'Khách hàng',
	NHAN_VIEN: 'Nhân viên',
	CAI_DAT: 'Cài đặt tài khoản',
	LOGOUT: 'Đăng xuất',
};
const { Search } = Input;
const checkKey_admin = 'checkKey_admin';
const WrapSearch = styled(Search)`
	.ant-input {
		border-radius: 8px;
	}
	.ant-input-group-addon {
		background-color: blue !important;
		border-top-right-radius: 7px !important;
		border-bottom-right-radius: 7px !important;
		.ant-btn-primary {
			background-color: blue !important;
			border-color: blue;
			border-top-right-radius: 7px !important;
			border-bottom-right-radius: 7px !important;
		}
		& > button {
			border-radius: 8px;
		}
	}
`;

const WrapSider = styled(Sider)`
	display: flex;
	flex-direction: column;
	background-color: white;
	.ant-layout-sider-trigger {
		background-color: white !important;
		color: black;
	}
`;
function LayoutAdmin() {
	// hooks
	const accountAdmin = useSelector((state) => state['accountAdmin']);
	const { getListCategory } = useCategoryLogicData();
	const { getListProduct } = useProductLogicData();
	const { getListSlider } = useSliderLogicData();
	const { getListCustomer } = useCustomerLogicData();
	const { getListAdmin } = useUserAdminLogicData();
	const { getListCart } = useCartLogicData();
	const { getListTransaction } = useTransactionData();
	const history = useHistory();

	// context
	const { setTextSearch } = React.useContext(ContextApp);

	// state
	const [collapsed, setCollapsed] = useState(false);
	const [checkKey, setCheckKey] = useState();
	const [sizeLayout, setSizeLayout] = useState(200);

	// lifecycle
	React.useEffect(() => {
		const checkKeyLocal = localStorage.getItem(checkKey_admin);
		setCheckKey(checkKeyLocal ? checkKeyLocal : objectKey.TRANG_CHU);
	}, []);

	React.useEffect(() => {
		checkKey && localStorage.setItem(checkKey_admin, checkKey);
	}, [checkKey]);

	const toggle = () => {
		setCollapsed(!collapsed);
		collapsed === true ? setSizeLayout(200) : setSizeLayout(77);
	};
	const onSearch = (value) => setTextSearch(value);

	React.useEffect(() => {
		getListCategory().catch();
		getListProduct().catch();
		getListSlider().catch();
		getListCustomer().catch();
		getListAdmin().catch();
		getListTransaction({}, true).catch();
		getListCart({}).catch();

		// check chưa đăng nhập thì quay lại trang login của admin
		accountAdmin && Object.keys(accountAdmin).length === 0 && history.push('/admin');
	}, []);

	// JSX
	const ComponentHeader = (
		<Header
			className={Style.site_layout_background}
			style={{
				position: 'fixed',
				zIndex: 1,
				width: '100%',
				backgroundColor: '#6d9eeb',
				borderBottom: '1px solid #0c53c3',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex' }}>
					<div style={{ padding: '0 10px' }}>
						{React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
							className: 'trigger',
							onClick: toggle,
						})}
					</div>
					<div>
						<h1 style={{ color: '#d9363e', fontSize: '35px', fontWeight: 'bold' }}>
							FAHASA
						</h1>
					</div>
				</div>

				<WrapSearch
					placeholder={'Tìm kiếm nhanh'}
					onSearch={onSearch}
					enterButton
					style={{ width: 350, marginTop: '15px' }}
				/>
				<div style={{ display: 'flex', marginRight: '30px' }}>
					<div style={{ marginRight: '10px', cursor: 'pointer' }}>
						<Avatar
							style={{ width: '30px', height: '30px' }}
							icon={<UserOutlined />}
							src={`${BASE_URL_IMAGE}${accountAdmin.avatar}`}
						/>
					</div>
					<div>{accountAdmin.name}</div>
				</div>
			</div>
		</Header>
	);
	const ComponentContent = (
		<Content
			className={Style.site_layout_background}
			style={{
				marginLeft: '24px',
				minHeight: 280,
			}}
		>
			<ContentAdmin checkKey={checkKey} objectKey={objectKey} />
		</Content>
	);
	const ComponentSlider = (
		<WrapSider
			style={{
				overflow: 'auto',
				height: '100vh',
				left: 0,
				top: '64px',
				position: 'sticky',
			}}
			collapsible
			collapsed={collapsed}
			onCollapse={() => toggle()}
		>
			<div className={Style.menu_admin}>
				<MenuAdmin objectKey={objectKey} setCheckKey={setCheckKey} />
			</div>
		</WrapSider>
	);
	return (
		<Layout style={{ minHeight: '100vh', display: 'flex' }}>
			{
				/* Header */
				ComponentHeader
			}
			<Layout className={Style.site_layout} style={{ marginTop: '110px' }}>
				{
					/* Slider */
					ComponentSlider
				}
				{
					/* Content */
					ComponentContent
				}
			</Layout>
		</Layout>
	);
}

LayoutAdmin.propTypes = {};

LayoutAdmin.defaultProps = {};

export default React.memo(LayoutAdmin);
