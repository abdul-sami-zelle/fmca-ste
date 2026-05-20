'use client'

import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./OrderConfirmationPage.css";
import DeliveryLocationMap from "./DeliveryLocationMap";
import axios from "axios";
import { formatedPrice } from "../../../utils/api";
import { url } from "../../../utils/api";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { getOptionNames } from "../../../utils/api";
import Loader from "@/UI/Components/Loader/Loader";





export default function OrderConfirmationPage() {
    const params = useParams(); // Get _id from URL params
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const router = useRouter();

    const handleNavigate = () => {
        router.push('/');
    }

    const [currentUrl, setCurrentUrl] = useState('/order-confirmation/:_id');
    const path = usePathname()
    useEffect(() => {
        setCurrentUrl(path);
    }, [path]);

    // Fetch order details based on _id
    const [mainOrderProduct, setMainOrderProduct] = useState(null)
    const [remainingOrderProducts, setRemainingOrderProducts] = useState([]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`${url}/api/v1/orders/get_by_id?_id=${params.id}`);

                setOrder(response?.data?.order); // Store order data in state
                setMainOrderProduct(response?.data?.order?.items[0]);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [params.id]); // Re-run the effect when _id changes



    const handleSelectedProduct = (item) => {
        setMainOrderProduct(item)
    }



    if (loading) {
        return <Loader />; // Show loading state while fetching data
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error if fetch fails
    }

    if (!order) {
        return <div>No order found</div>; // Show message if no order found
    }



    return (
        <div className="order_confirmation_page">

            <div className="order_description">

                <Link href={'/'} className="header_order_description">
                    <Image src={'/Assets/Logo/fm-new-logo.png'} width={200} height={45} alt="" />
                </Link>

                <div className="order_description_1">
                    {/* <img src={checked} alt="" /> */}
                    <div className="desktop-screen-svg-icon">
                        <svg width="45" height="45" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                            <rect width="128" height="128" fill="url(#pattern0_9588_61290)" />
                            <defs>
                                <pattern id="pattern0_9588_61290" patternContentUnits="objectBoundingBox" width="1" height="1">
                                    <use href="#image0_9588_61290" transform="scale(0.0078125)" />
                                </pattern>
                                <image id="image0_9588_61290" width="128" height="128" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAFEdJREFUeJztnX+UFNWVx7/3dTWKzixiTAQSN2I2EFc0Mb+IPzMgiMQzxuyeytQrmIRgnBgTsyc/NfFXowLRxF1/RDHmSFyGruq2XeNv/B2zmCjq6p6ACCYxRg2gBIWdUch0Vd39o6txkJnp96qruntm+nMOh5nm3Xr38L39quq9d+8jjDzItu3JQRAcTkSHATgUwCEA3gfgPeGffQGMAbA/gLeI6Anf96/I5/MP1MvpekH1dqBaLMuaJIQ4jpmPA/ApAEcCaI1wKQbwfdd1r4zVwQZn2AWAaZpjDMP4LBHNZebPAZga4+UDZp6ey+WejvGaDY1RbwdUaGtrMyZOnDiLmTuI6HQABzBzEl0JAGcB+GoSF29EGjoAOjs7J3uedwaArwCYRJT8gEVERybeSQPRkAFgWdYJAL7reV47St/KWvJ2jfurKw0VAJZlnUpEFwH4dL18IKJH6tV3PWiIALBtewYzLwZwTJ1d2QTgZ3X2oabUNQAsy5pERFcys1VPP0JeAvB5x3HerLcjtaQur4HhU/03ASwC8A816nYHgG0AegG8Ff69HcAbANZ4npcrFAo7a+RLw1DzALAs61giuh7ARxPq4q/MvIaIXgDwghDi+b6+vhcKhcIbCfU3rKlZAJimmUqn0xcy8wUAUjFeeiszrxFCPAbgIcdxnkFpVq+JAjUJgPBenwXQFtMl3wCQE0J0Z7PZNWgKHpnEHwI7OjpOJqJulBZjqqEI4B5mXuH7/j2FQqEvBvdGPUmOAGRZ1iIiOh/VTebsZOabfN//SaFQeDku55qUSCQATNNMpVKpnxPRGVVcppeIlgdBcHkul9sUm3NN9iD2W0B7e/t+hmEUAHwu4iV8Zl7m+/7FzSf36EgpPwvg3wB8EkCRiH7LzJe7rvtc/3axjgC2bY8PguAuIjouij0RPQPg647jPBmnX6MNKeV5AJZgb313EdE8x3FuK38Q20KLaZrvZ+bVEcV/E8BZU6ZM+VRT/OqwbftCAEsx8Jd7XwDdlmUdUv4glluAaZrjDMO4F8AREcyfZOaOXC73Uhy+jGaklBcx86Kh2jDzfgDOBHAREMMIYJrmWMMw7gZwlKYpE9E1ra2txzfFrx7Lsi5GaWq9IkT08fLPVY0AXV1d6Z6enlsBHK9p+jci+rLjOPdW03+TEpZlXUxEGQ2T3XMo1QQA9fb23gT9p/0NRHSK4zh/qaLvJiG2bWeY+WIdG2ZeXf458i3AsqxFzNypafYkgBOa4seDlHKRrvgA/ppKpW4q/xLpNTDcwPEg9BZ1Hhk7duzpy5cv74nSZ5M9kVIuQvggp8F2Zp7df9ezdgCECzvPQm9uv+B53vzm/H08RBR/BzPPyeVya/p/qHULyGQyQgixAhriE9HD27dv72yKHw9xig9orstPmDBhEYAFqu2Z+SnP8+becccdo26nTRJYlnVJuGlWhx1EdLLrugNOsCnfAsKdPKuhPmpsBHC867p/U+2jyeCE4l+oabaDiE4eanZVScy2tjYj3MalKv5WIprTFD8eIoq/vZL4gOI8wIQJE86B+h4+BnBG81UvHmzbvjTcRqfDdiKao7KuUvEWYJrmBMMwNgAYp9j5Utd1f6TYtskQRBU/CIKT8/n8UyqNKw7p6XT6KiiKz8xPtLa26k5MNBmAWogPVBgBwgkf1VSpN4QQH81ms6+qdt5kYKSUlwE4X9NMW3ygwggQBMESjWv9qCl+9dRSfGCIAAgTNT+jeJ2np06d+gvdzpvsSa3FB4Z4C9CYcPCDIPhaJpMJojjQpIRlWYsB6D48b2fm2fl8PnJFkwFHANu2T4R6ivb1+Xz+magONCmJT0SRxK+2nM2AARAEwXcU7Xs8z8tU48BoJ6L4b8YhPjBAAHR2dk4monZF+2XNrdvRkVIuiSj+yXEVstorAMKaPCpTvrtSqdRVcTgxGpFSLgHwQ02zN4kolm9+mT2EbmtrM1AqyKTCL1auXLk5LkdGE9WI7zjO/8Tpyx5vARMnTpwFYJKCXdHzvJ/G6choQUq5FMB5mmaJiA/s/RqoWqrl7maipj4Rxd8KYJbjOL9PwKV3bgGmaY4BcJqKETN3J+HMSKYa8V3XTUR8oN8IIIRoAzBeweaNHTt2NPfzq0NSyv9AKVFTh61CiJOy2ezaJJwqs3sEEELMVTEgInfVqlV/T86lEUVDiw/s+RZwiooBEa1MyJeRRsOLD4TLweFW778qtN/quu7BaNbkqQTZtn0VM39L066m4gPhCEBEqrl9v0ZT/EpEFf/1WosPvPMQeKxKY2b+dYK+jARISnk1M5+jafd6EAQnua67LhGvhqAcAJ9SaayxO0gZ27Y/Fua3zUapgMEGIrqhWCwuKxQKftz9JQhZlnUNgG9q2r0G4KR8Pv9cxZYJIFB6Dpim0HZTPp9/Ic7OLcs6lZmfAHA6Suf3pAAcwczXGoZxa1dXVzrO/hKEbNu+loi0xRdCzHx33Z5aImzbngy1er17pRVVg2maB4b1A/cZpMnpPT09/5nJZGp9XoAuZNv2tcz8DU2714QQM7PZ7PpEvFJEENE/K7bdGGfH6XS6A5UnnuSGDRuujrPfmCEp5c+Gq/gAIIIgmKzYdkOcHQdBoBR4RPTNsPxJo0GWZV0H4GxNuy1BEMxoBPGB0jPAoUoNhYh1BCAi5aNZiChjWZbutyxJyLKs64jo65p2W4IgmJnP559PxKsICAD/qNKwr68v1gfAIAge1mlPRNdIKWWcPkSEbNu+Por4AGY0kvhAKQAOUmj3Ztxbv/L5/IMoTSypIgDcLKVUmrJOCJJSLmPmszTtNgOY4bpurLfRODCgFgA7EuibPc/rMAzjMQBTFG3GALhVSjnbdd3HE/BpKEhKuQzA1zTtNgOYWS/xpZQHATgHpVL9+wB4LgiCG8p5BAKls3QrkUhdn0KhsFUIcRIAnUzi/QGssm37Y0n4NAgkpfwZ9MV/TQgxq17iW5Z1NIB1KFUUORHAdAALhRBPSCm/C5QCYKzCtRIr7JTNZl8lotkAXtcwG8fM93R2dqq+wVRDWXzdp/26vuq1t7fvR0R3ADh4gH8WAH4ipZwtiGiMwvUSrezlOM4fwq3ovRpmkzzPe9A0zQlJ+YVhKj4AtLS02Cidmj4YBOAHgpkHm4nrT+Kl3cJiBp8HoLPZ5EOGYdxv27bKTiZdor7n1138EJXMrukNNc3quu4jKG1M1VkEOoqZ72lvb98vRlciv+c3iPgAcKBCm7EC/erGDkFrlc4o47ru7QB0J32OaWlpyYV5DdVS1SRPg4gPqK3v/L3hAgAAXNf9eYRyaO0TJ078Jao7BCPyJE+jzfAxs4pmfxconaJZiZoGAAA4jnMpgH/XNJsvpYy6eES2bV8fYZKn4cQHACJqUWj2tkDpDL5K1DwAAMB13e8B+KWm2Tm2bZ+raRNV/FdTqdQJjSY+ABCRyi1gmwCgUstPtUJY3LDneWcC+JWWEfNSy7LOVGwedXr31VQqNWPlypV/1LSrCcysotk2gVL2SSXGm6ap8lQZO4VCwfc8bx6A1RUbvwMR0TLbts2hGmUyGWFZ1nLoz/A1tPjh9G/FACCirQKAUo6fYRhTq3UsKoVCYafnee0AntUwSzHzyo6OjpMH+sdMJiM2bty4nIgWaLrzSiOLH/IRlUbM/BcBxXl4IqpbAABAoVDYYRjGKQB0lqXHCCFutSzrk/0/LIsP4MuabrwSBEGji6+sFTP/WTDzi4qN6xoAANDd3f06Ec1FaYVNlVYiWtXR0XE4UL34+Xz+T5p2NYeZlVZXieglkU6nVScu6h4AAOA4zotCiDkonTWoykFCiAc6Ozsnj3TxAfUvq+d560V3d/dLAP5Pof30qryKkTB75jQAOucQfMDzvLXQFJ+IXiaituEiPgAQkUqex/ZCofCKAMDMrJKONGn+/PkNMQoAgOu6jwkhvojSsfKq7K/ZzSu+7890HEfpNtkIhLc6lSovawFwOTdQqcpkEAQzq/AtdrLZ7N1E9BUAsRepJKKXh9OwXyaVSp2k0o6I1gBhcigz/1bFiJlnRHctGRzHyUZIxBwSInoZpQ2cw0p8AAiCQEmjsuYCAAzDUAoAADMQ84njcZDL5a4DsDiOa5XFH07DfplMJiOIqE2hKRuG8TsgDICw3JvKfPZBUkrVAtI1xXXdC4jommquMZzFB4CNGzceC7V9AGu7u7tfB/pVCCGi+1Q6iXBaaM2YMmXKt4koH8V2uIsPqGvDzKvKP4uBPhwKIuqYO3euyjaympPJZIKWlpZOAErBXIaIXk6lUm3DWfwFCxbsS0RfVGy++/9ndwC0trY+CrWl4QPHjx9/qp57tePGG28s9vb2/iuA36m0L4vf3d3954RdS5S+vr52AAcoNP3bli1bHiv/sjsAbrzxxiKAO1Q6a+TbAADcddddb6fT6dMAVJrl/MtIEB/QGv5ve/TRR73y73tsCtW4f55qmqZSTmG9WLFixbZwyniwxaONnuedOBLEtyzrUChWeQNwS/9f9giATZs2PQxApVpYOpVKfV+xw7qRzWZf3WeffaYD+DEz/xGlLed/ArBUCPHpkVLuVghxLgCVaiqv+r7/aP8P9nqn1ziubBczfyiXy21Sc7NJEsyfP3+i7/svolRfaUiIaJHjOJn+n+2VFxAEwU1Qm1rdVwjxbVVHmySD7/s/gIL4APxisbj83R/uFQC5XO4lAHeqdM7MZ33pS19SSS5tkgCdnZ3vI6Iuxea3D3TLGywz6ErFi7Z4nrdIsW2TmPE87zJmVs2IGlDTQef1Lct6XPHcwICZp8d5jEmTysybN+8zQRD8FmrH+6x2XffEgf5hUGNmvkTRF0FEN5immVJs36RKTNNMBUFwPdTEBzMPOkoPeoF8Pr8KwH8r+vSJdDqtei9qUiWpVOobAI5WbP5YLpcbtB5TpQhSzs9j5iWNPjk0ErBt+4NEpDo6sxBiyFNKhgwA13V/A8BV7OwAwzBuCY+eaZIAXV1daWZ2oJipRUS3ZLPZIfd6VLyHeJ73HQDb1VzEdMMwLlVs20STnp6eH0OxsjuAnUEQVDyjqOKD2/r163unTZu2M9yPr8Kx06ZNe3rdunV/UGzfRAEpZTuAq6G4I4uZL8nlchXnc5SeIn3fvw7A/6q0RSkv7+YaFXAaFdi2fRiAm6G+HW+d7/tXqDRUCoCwbv/ZUN99e5DnefeZpvlexfZNBkFKeXAQBPdDbasXAPhCiDMLhYJK4Q+1AACAsDDjZartAUwxDOPehQsX1qW2wEhg4cKFrUR0LxH9k6oNM2ey2ewTqu21ikRNnTp1EYCHNEw+uXPnzjsadQtZI2Oa5phdu3bdyswf1zD7te/7S3X60d7iHS4/PouBCxAOxn95nmerDkujnblz5+4zbtw4h4j+RcNsM4CjXdd9TaevSHv8bduewcwPQuEtoh+PCCG+kM1mVfIQRy2mabYYhnErgDkaZgERzXEcR2d0BqAn4G7Wrl370lFHHSVQKkCsymRmnn344Yffvn79euWzAkYTUsqDU6nUQwBO0LFj5otc1705Sp9VlVSzLCtKhY0XmHlOuO+gSYht24cFQXC/zgMfADDzTblc7kxEPM+xmkqh7Pv+V6FZwAnAFCJ62rKsht1aXmuklO3M/FQE8e/esmXLWajiMM+q8/xM0xxrGMYDAFRPHy3DRHRtsVj8/mh9OGxrazMmTZp0ATNfCM0vIzM/kU6nZ3V3d6vUeRyUWBI9TdMcZxjGbwB8VNeWmZ9Kp9MdI2F7tg6WZR1CRDmoz+335znP806M4xSX2DJ9wwOoHwBwRATz7cx8ge/7Nwyz00K1MU0zZRjG2QAuRbT6i+vCZ6hYdmPHmupt2/Z4Zr4T+reDMs8C+EYdjoOpCbZtf4KZr4daKfeBWJNOp09dsWLFtrh8ij3Xv729fb+WlpYcgPaIlwgA/ALABa7rqlQxbXhM03yvYRiLAZyB6A/ed3qeZxUKBZ26SBVJpNhDOMwtA6BarnUg3iKim4rF4hWFQkElW6nh6OzsfF+xWPyOEOIcjd27A7Fi8+bNZ/TP6YuLJKt9kJTyQpS2lVWzYXQXgOVEdIXjODqHS9UNy7IOFUKcy8xfweBnI6vgM3Mml8stRhWvekOReLkXKeVMAFkA1Z7tUwSwipm7d+zYcdeqVat0jpZJnAULFuzb19fXHmbpzkXpSL5q2ExE8xzH0TlbUZua1PsxTXNCOp1eycxKFawUeBPALUKI7g9/+MOPZzKZ2KuEqRBWHT2WmTvD4gwq+fkqPARgvu7CThRqWfCJbNv+ATMvRnW3hHfTA2ANET0E4CHHcZ5BQsMlsHt3zixmngVgJtTOXVTFJ6LLisXipbV6Ha55xS8p5TEoPeVHmS9QYTOANSitOWxMpVIbgyDYqPtGIaU8SAgxlZk/wsxTmHkqEX0awMREvAbWCSHO1NnMEQd1KflmmuaYVCr1QyI6D2qZrXHQA2AbgF5m7iWiXrxTb3g8M7eEx6y0oPStrtVOpp1EtLRYLF5ejynxutb8mzdv3geYeQkzz6+3L/WAme9Op9Pfquc0eEP8p1uWdQIRLYbmOvgw5jdCiPMrJW3UgoYIgDJSytnMfDERHVdvXxJiNTMvGipXr9Y0VACUkVIew8zfI6LTUd2ehUYgAPArIcRPa/2Ap0JDBkAZ0zTfn06n54cneh1ab3802cTM3el0+ueNvNTd0AFQxjTNVDqdnsHMHQC+gHjfveNkG4DbmDnv+/6jw2Fpe1gEQH+6urrSPT09J6BUF+8UAEfW2aXfA7iPiO7btGnT6iQWbJJk2AXAuwlX3I4jouNRWmc/EskddLkdpZM2ngKw2jCM35Wrbg9Xhn0ADIRt2x9k5sOJaDIzTwZwCEqJLO8J/+yH0mJNebKnB4AH4G2UhvFtAF4D8AoR/RnAi8Vi8fmRUliyP/8PNKwG/PM5Dr4AAAAASUVORK5CYII=" />
                            </defs>
                        </svg>
                    </div>

                    {/* <div className="mobile-screen-svg-icon-check">
                        <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
                            <rect width="64" height="64" fill="url(#pattern0_9588_61290)" />
                            <defs>
                                <pattern id="pattern0_9588_61290" patternContentUnits="objectBoundingBox" width="1" height="1">
                                    <use href="#image0_9588_61290" transform="scale(0.0078125)" />
                                </pattern>
                                <image id="image0_9588_61290" width="64" height="64" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAFEdJREFUeJztnX+UFNWVx7/3dTWKzixiTAQSN2I2EFc0Mb+IPzMgiMQzxuyeytQrmIRgnBgTsyc/NfFXowLRxF1/RDHmSFyGruq2XeNv/B2zmCjq6p6ACCYxRg2gBIWdUch0Vd39o6txkJnp96qruntm+nMOh5nm3Xr38L39quq9d+8jjDzItu3JQRAcTkSHATgUwCEA3gfgPeGffQGMAbA/gLeI6Anf96/I5/MP1MvpekH1dqBaLMuaJIQ4jpmPA/ApAEcCaI1wKQbwfdd1r4zVwQZn2AWAaZpjDMP4LBHNZebPAZga4+UDZp6ey+WejvGaDY1RbwdUaGtrMyZOnDiLmTuI6HQABzBzEl0JAGcB+GoSF29EGjoAOjs7J3uedwaArwCYRJT8gEVERybeSQPRkAFgWdYJAL7reV47St/KWvJ2jfurKw0VAJZlnUpEFwH4dL18IKJH6tV3PWiIALBtewYzLwZwTJ1d2QTgZ3X2oabUNQAsy5pERFcys1VPP0JeAvB5x3HerLcjtaQur4HhU/03ASwC8A816nYHgG0AegG8Ff69HcAbANZ4npcrFAo7a+RLw1DzALAs61giuh7ARxPq4q/MvIaIXgDwghDi+b6+vhcKhcIbCfU3rKlZAJimmUqn0xcy8wUAUjFeeiszrxFCPAbgIcdxnkFpVq+JAjUJgPBenwXQFtMl3wCQE0J0Z7PZNWgKHpnEHwI7OjpOJqJulBZjqqEI4B5mXuH7/j2FQqEvBvdGPUmOAGRZ1iIiOh/VTebsZOabfN//SaFQeDku55qUSCQATNNMpVKpnxPRGVVcppeIlgdBcHkul9sUm3NN9iD2W0B7e/t+hmEUAHwu4iV8Zl7m+/7FzSf36EgpPwvg3wB8EkCRiH7LzJe7rvtc/3axjgC2bY8PguAuIjouij0RPQPg647jPBmnX6MNKeV5AJZgb313EdE8x3FuK38Q20KLaZrvZ+bVEcV/E8BZU6ZM+VRT/OqwbftCAEsx8Jd7XwDdlmUdUv4glluAaZrjDMO4F8AREcyfZOaOXC73Uhy+jGaklBcx86Kh2jDzfgDOBHAREMMIYJrmWMMw7gZwlKYpE9E1ra2txzfFrx7Lsi5GaWq9IkT08fLPVY0AXV1d6Z6enlsBHK9p+jci+rLjOPdW03+TEpZlXUxEGQ2T3XMo1QQA9fb23gT9p/0NRHSK4zh/qaLvJiG2bWeY+WIdG2ZeXf458i3AsqxFzNypafYkgBOa4seDlHKRrvgA/ppKpW4q/xLpNTDcwPEg9BZ1Hhk7duzpy5cv74nSZ5M9kVIuQvggp8F2Zp7df9ezdgCECzvPQm9uv+B53vzm/H08RBR/BzPPyeVya/p/qHULyGQyQgixAhriE9HD27dv72yKHw9xig9orstPmDBhEYAFqu2Z+SnP8+becccdo26nTRJYlnVJuGlWhx1EdLLrugNOsCnfAsKdPKuhPmpsBHC867p/U+2jyeCE4l+oabaDiE4eanZVScy2tjYj3MalKv5WIprTFD8eIoq/vZL4gOI8wIQJE86B+h4+BnBG81UvHmzbvjTcRqfDdiKao7KuUvEWYJrmBMMwNgAYp9j5Utd1f6TYtskQRBU/CIKT8/n8UyqNKw7p6XT6KiiKz8xPtLa26k5MNBmAWogPVBgBwgkf1VSpN4QQH81ms6+qdt5kYKSUlwE4X9NMW3ygwggQBMESjWv9qCl+9dRSfGCIAAgTNT+jeJ2np06d+gvdzpvsSa3FB4Z4C9CYcPCDIPhaJpMJojjQpIRlWYsB6D48b2fm2fl8PnJFkwFHANu2T4R6ivb1+Xz+magONCmJT0SRxK+2nM2AARAEwXcU7Xs8z8tU48BoJ6L4b8YhPjBAAHR2dk4monZF+2XNrdvRkVIuiSj+yXEVstorAMKaPCpTvrtSqdRVcTgxGpFSLgHwQ02zN4kolm9+mT2EbmtrM1AqyKTCL1auXLk5LkdGE9WI7zjO/8Tpyx5vARMnTpwFYJKCXdHzvJ/G6choQUq5FMB5mmaJiA/s/RqoWqrl7maipj4Rxd8KYJbjOL9PwKV3bgGmaY4BcJqKETN3J+HMSKYa8V3XTUR8oN8IIIRoAzBeweaNHTt2NPfzq0NSyv9AKVFTh61CiJOy2ezaJJwqs3sEEELMVTEgInfVqlV/T86lEUVDiw/s+RZwiooBEa1MyJeRRsOLD4TLweFW778qtN/quu7BaNbkqQTZtn0VM39L066m4gPhCEBEqrl9v0ZT/EpEFf/1WosPvPMQeKxKY2b+dYK+jARISnk1M5+jafd6EAQnua67LhGvhqAcAJ9SaayxO0gZ27Y/Fua3zUapgMEGIrqhWCwuKxQKftz9JQhZlnUNgG9q2r0G4KR8Pv9cxZYJIFB6Dpim0HZTPp9/Ic7OLcs6lZmfAHA6Suf3pAAcwczXGoZxa1dXVzrO/hKEbNu+loi0xRdCzHx33Z5aImzbngy1er17pRVVg2maB4b1A/cZpMnpPT09/5nJZGp9XoAuZNv2tcz8DU2714QQM7PZ7PpEvFJEENE/K7bdGGfH6XS6A5UnnuSGDRuujrPfmCEp5c+Gq/gAIIIgmKzYdkOcHQdBoBR4RPTNsPxJo0GWZV0H4GxNuy1BEMxoBPGB0jPAoUoNhYh1BCAi5aNZiChjWZbutyxJyLKs64jo65p2W4IgmJnP559PxKsICAD/qNKwr68v1gfAIAge1mlPRNdIKWWcPkSEbNu+Por4AGY0kvhAKQAOUmj3Ztxbv/L5/IMoTSypIgDcLKVUmrJOCJJSLmPmszTtNgOY4bpurLfRODCgFgA7EuibPc/rMAzjMQBTFG3GALhVSjnbdd3HE/BpKEhKuQzA1zTtNgOYWS/xpZQHATgHpVL9+wB4LgiCG8p5BAKls3QrkUhdn0KhsFUIcRIAnUzi/QGssm37Y0n4NAgkpfwZ9MV/TQgxq17iW5Z1NIB1KFUUORHAdAALhRBPSCm/C5QCYKzCtRIr7JTNZl8lotkAXtcwG8fM93R2dqq+wVRDWXzdp/26vuq1t7fvR0R3ADh4gH8WAH4ipZwtiGiMwvUSrezlOM4fwq3ovRpmkzzPe9A0zQlJ+YVhKj4AtLS02Cidmj4YBOAHgpkHm4nrT+Kl3cJiBp8HoLPZ5EOGYdxv27bKTiZdor7n1138EJXMrukNNc3quu4jKG1M1VkEOoqZ72lvb98vRlciv+c3iPgAcKBCm7EC/erGDkFrlc4o47ru7QB0J32OaWlpyYV5DdVS1SRPg4gPqK3v/L3hAgAAXNf9eYRyaO0TJ078Jao7BCPyJE+jzfAxs4pmfxconaJZiZoGAAA4jnMpgH/XNJsvpYy6eES2bV8fYZKn4cQHACJqUWj2tkDpDL5K1DwAAMB13e8B+KWm2Tm2bZ+raRNV/FdTqdQJjSY+ABCRyi1gmwCgUstPtUJY3LDneWcC+JWWEfNSy7LOVGwedXr31VQqNWPlypV/1LSrCcysotk2gVL2SSXGm6ap8lQZO4VCwfc8bx6A1RUbvwMR0TLbts2hGmUyGWFZ1nLoz/A1tPjh9G/FACCirQKAUo6fYRhTq3UsKoVCYafnee0AntUwSzHzyo6OjpMH+sdMJiM2bty4nIgWaLrzSiOLH/IRlUbM/BcBxXl4IqpbAABAoVDYYRjGKQB0lqXHCCFutSzrk/0/LIsP4MuabrwSBEGji6+sFTP/WTDzi4qN6xoAANDd3f06Ec1FaYVNlVYiWtXR0XE4UL34+Xz+T5p2NYeZlVZXieglkU6nVScu6h4AAOA4zotCiDkonTWoykFCiAc6Ozsnj3TxAfUvq+d560V3d/dLAP5Pof30qryKkTB75jQAOucQfMDzvLXQFJ+IXiaituEiPgAQkUqex/ZCofCKAMDMrJKONGn+/PkNMQoAgOu6jwkhvojSsfKq7K/ZzSu+7890HEfpNtkIhLc6lSovawFwOTdQqcpkEAQzq/AtdrLZ7N1E9BUAsRepJKKXh9OwXyaVSp2k0o6I1gBhcigz/1bFiJlnRHctGRzHyUZIxBwSInoZpQ2cw0p8AAiCQEmjsuYCAAzDUAoAADMQ84njcZDL5a4DsDiOa5XFH07DfplMJiOIqE2hKRuG8TsgDICw3JvKfPZBUkrVAtI1xXXdC4jommquMZzFB4CNGzceC7V9AGu7u7tfB/pVCCGi+1Q6iXBaaM2YMmXKt4koH8V2uIsPqGvDzKvKP4uBPhwKIuqYO3euyjaympPJZIKWlpZOAErBXIaIXk6lUm3DWfwFCxbsS0RfVGy++/9ndwC0trY+CrWl4QPHjx9/qp57tePGG28s9vb2/iuA36m0L4vf3d3954RdS5S+vr52AAcoNP3bli1bHiv/sjsAbrzxxiKAO1Q6a+TbAADcddddb6fT6dMAVJrl/MtIEB/QGv5ve/TRR73y73tsCtW4f55qmqZSTmG9WLFixbZwyniwxaONnuedOBLEtyzrUChWeQNwS/9f9giATZs2PQxApVpYOpVKfV+xw7qRzWZf3WeffaYD+DEz/xGlLed/ArBUCPHpkVLuVghxLgCVaiqv+r7/aP8P9nqn1ziubBczfyiXy21Sc7NJEsyfP3+i7/svolRfaUiIaJHjOJn+n+2VFxAEwU1Qm1rdVwjxbVVHmySD7/s/gIL4APxisbj83R/uFQC5XO4lAHeqdM7MZ33pS19SSS5tkgCdnZ3vI6Iuxea3D3TLGywz6ErFi7Z4nrdIsW2TmPE87zJmVs2IGlDTQef1Lct6XPHcwICZp8d5jEmTysybN+8zQRD8FmrH+6x2XffEgf5hUGNmvkTRF0FEN5immVJs36RKTNNMBUFwPdTEBzMPOkoPeoF8Pr8KwH8r+vSJdDqtei9qUiWpVOobAI5WbP5YLpcbtB5TpQhSzs9j5iWNPjk0ErBt+4NEpDo6sxBiyFNKhgwA13V/A8BV7OwAwzBuCY+eaZIAXV1daWZ2oJipRUS3ZLPZIfd6VLyHeJ73HQDb1VzEdMMwLlVs20STnp6eH0OxsjuAnUEQVDyjqOKD2/r163unTZu2M9yPr8Kx06ZNe3rdunV/UGzfRAEpZTuAq6G4I4uZL8nlchXnc5SeIn3fvw7A/6q0RSkv7+YaFXAaFdi2fRiAm6G+HW+d7/tXqDRUCoCwbv/ZUN99e5DnefeZpvlexfZNBkFKeXAQBPdDbasXAPhCiDMLhYJK4Q+1AACAsDDjZartAUwxDOPehQsX1qW2wEhg4cKFrUR0LxH9k6oNM2ey2ewTqu21ikRNnTp1EYCHNEw+uXPnzjsadQtZI2Oa5phdu3bdyswf1zD7te/7S3X60d7iHS4/PouBCxAOxn95nmerDkujnblz5+4zbtw4h4j+RcNsM4CjXdd9TaevSHv8bduewcwPQuEtoh+PCCG+kM1mVfIQRy2mabYYhnErgDkaZgERzXEcR2d0BqAn4G7Wrl370lFHHSVQKkCsymRmnn344Yffvn79euWzAkYTUsqDU6nUQwBO0LFj5otc1705Sp9VlVSzLCtKhY0XmHlOuO+gSYht24cFQXC/zgMfADDzTblc7kxEPM+xmkqh7Pv+V6FZwAnAFCJ62rKsht1aXmuklO3M/FQE8e/esmXLWajiMM+q8/xM0xxrGMYDAFRPHy3DRHRtsVj8/mh9OGxrazMmTZp0ATNfCM0vIzM/kU6nZ3V3d6vUeRyUWBI9TdMcZxjGbwB8VNeWmZ9Kp9MdI2F7tg6WZR1CRDmoz+335znP806M4xSX2DJ9wwOoHwBwRATz7cx8ge/7Nwyz00K1MU0zZRjG2QAuRbT6i+vCZ6hYdmPHmupt2/Z4Zr4T+reDMs8C+EYdjoOpCbZtf4KZr4daKfeBWJNOp09dsWLFtrh8ij3Xv729fb+WlpYcgPaIlwgA/ALABa7rqlQxbXhM03yvYRiLAZyB6A/ed3qeZxUKBZ26SBVJpNhDOMwtA6BarnUg3iKim4rF4hWFQkElW6nh6OzsfF+xWPyOEOIcjd27A7Fi8+bNZ/TP6YuLJKt9kJTyQpS2lVWzYXQXgOVEdIXjODqHS9UNy7IOFUKcy8xfweBnI6vgM3Mml8stRhWvekOReLkXKeVMAFkA1Z7tUwSwipm7d+zYcdeqVat0jpZJnAULFuzb19fXHmbpzkXpSL5q2ExE8xzH0TlbUZua1PsxTXNCOp1eycxKFawUeBPALUKI7g9/+MOPZzKZ2KuEqRBWHT2WmTvD4gwq+fkqPARgvu7CThRqWfCJbNv+ATMvRnW3hHfTA2ANET0E4CHHcZ5BQsMlsHt3zixmngVgJtTOXVTFJ6LLisXipbV6Ha55xS8p5TEoPeVHmS9QYTOANSitOWxMpVIbgyDYqPtGIaU8SAgxlZk/wsxTmHkqEX0awMREvAbWCSHO1NnMEQd1KflmmuaYVCr1QyI6D2qZrXHQA2AbgF5m7iWiXrxTb3g8M7eEx6y0oPStrtVOpp1EtLRYLF5ejynxutb8mzdv3geYeQkzz6+3L/WAme9Op9Pfquc0eEP8p1uWdQIRLYbmOvgw5jdCiPMrJW3UgoYIgDJSytnMfDERHVdvXxJiNTMvGipXr9Y0VACUkVIew8zfI6LTUd2ehUYgAPArIcRPa/2Ap0JDBkAZ0zTfn06n54cneh1ab3802cTM3el0+ueNvNTd0AFQxjTNVDqdnsHMHQC+gHjfveNkG4DbmDnv+/6jw2Fpe1gEQH+6urrSPT09J6BUF+8UAEfW2aXfA7iPiO7btGnT6iQWbJJk2AXAuwlX3I4jouNRWmc/EskddLkdpZM2ngKw2jCM35Wrbg9Xhn0ADIRt2x9k5sOJaDIzTwZwCEqJLO8J/+yH0mJNebKnB4AH4G2UhvFtAF4D8AoR/RnAi8Vi8fmRUliyP/8PNKwG/PM5Dr4AAAAASUVORK5CYII=" />
                            </defs>
                        </svg>
                    </div> */}


                    <div className="order_description_1_0">
                        <p className="order_no">Order: ORDER-{order.uid}</p> {/* Use order data */}
                        {/* <p className="order_placer">
                            Thank you, {order.billing.first_name} 
                            {order.billing?.last_name}!
                        </p>  */}
                        <p className="order_placer">
                            Thank you, {order.billing.first_name.charAt(0).toUpperCase() + order.billing.first_name.slice(1)}
                            {order.billing?.last_name ? " " + order.billing.last_name.charAt(0).toUpperCase() + order.billing.last_name.slice(1) : ""}!
                        </p>
                    </div>
                </div>

                <div className="order_description_1_1">
                    {/* <MapComp
                        storesData={
                            Object.keys(selectedStore).length === 0
                                ? storesApiData
                                : selectedStore
                        }
                        selectedLocation={{
                            lat: selectedLatitude ? parseFloat(selectedLatitude) : null,
                            lng: selectedLongitude ? parseFloat(selectedLongitude) : null,
                        }}
                    /> */}
                    {/* <DeliveryLocationMap
                        address_info={`${order.shipping.address_1 === "" ?
                            order.billing.address_1 : order.shipping.address_1}, 
                        ${order.shipping.city === "" ? order.billing.city : order.shipping.city} 
                        ${order.shipping.state === "" ? order.billing.state : order.shipping.state},
                        US`}
                        width={'580px'}
                        height={'220px'}
                    /> */}
                    <p style={{ marginTop: "5px" }} className="heading2">Your Order is Confirmed</p>
                    <p style={{ marginBottom: "15px" }} className="para1">We’ve accepted your order, we are getting it ready. Come back to this page for updates on your shipment.</p>
                    <span style={{ marginBottom: "10px" }} className="separator"></span>
                    <p className="para2">TRACKING NUMBER</p>
                    <p style={{ fontWeight: "600" }} className="para1">{order._id}</p> {/* Use order data */}
                </div>

                <div className="order_description_1_2">
                    <p className="heading">Order Details</p>
                    <div className="order_description_1_2_0">
                        <div className="column">
                            <p className="sub_heading">
                                Contact Information
                            </p>
                            <p className="sub_content">
                                {order.billing.email} {/* Use order data */}
                            </p>


                            <p style={{ marginTop: "10px" }} className="sub_heading">
                                Billing Address
                            </p>
                            <p className="sub_content">
                                {order.billing.address_1} {/* Use order data */}
                            </p>
                            <p className="sub_content">
                                {order.billing.city}, {order.billing.state} {/* Use order data */}
                            </p>

                            <p style={{ marginTop: "10px" }} className="sub_heading">
                                Shipping Method :
                            </p>
                            <p className="sub_content">
                                {order.is_shipping === 1 ? "Shipping" : "Local Pickup"} {/* Use order data */}
                            </p>
                        </div>
                        <div className="column">
                            <p className="sub_heading">
                                Payment Method
                            </p>
                            <span className="sub_content">
                                {/* <img src={card} alt="" /> */}
                                <p>{(order?.payment_method === 'cybersource_credit_card' || order?.payment_method === 'authorize_net' ) ? 'Credit Card' : ''}</p>
                                <svg width="25" height="25" viewBox="0 0 91 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.183594 9H90.0453V15.5L86.5 17L84.5 18L82.6836 19H0.183594V9Z" fill="var(--secondary-color)" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 4C0 1.79086 1.79086 0 4 0H86C88.2091 0 90 1.79086 90 4V9H0V4ZM82.6853 19H0V56C0 58.2091 1.79086 60 4 60H86C88.2091 60 90 58.2091 90 56V50.554C81.984 48.7351 76 41.5663 76 33C76 27.3455 78.6073 22.2999 82.6853 19Z" fill="#FDFDFD" />
                                    <rect x="5" y="50" width="36" height="6" fill="var(--secondary-color)" />
                                    <rect x="62" y="50" width="18" height="6" fill="var(--secondary-color)" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M90 9H0V19H82.6836C84.7852 17.3008 87.2734 16.0645 90 15.4453V9Z" fill="var(--secondary-color)" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="checkout-need-help-or-continue-shopping">
                    <span className="checkout-page-contact-us-link-item">
                        <p className="checkout-need-help-heading">Need help?</p>
                        <Link className="checkout-contact-item" href={'/contact-us'}>Contact us</Link>
                    </span>
                    <button className="checkout-continue-shopping-button" onClick={handleNavigate}>
                        Go To Home
                    </button>
                </div>

            </div>


            <div className="order_details">
                <div className="cart_product_items">

                    <div className="order-products-main-product-container">
                        <div className="order-product-main-image-container">
                            <Image src={url + mainOrderProduct?.image} width={588} height={320} alt="product image" />
                        </div>
                        <div className="order-product-details-container">
                            <h3>{mainOrderProduct.name}</h3>
                            <div className="order-container-attributes-and-price-container">
                                <div className="order-price-attributes-container">
                                    {getOptionNames(mainOrderProduct.attributes).map((item, index) => (
                                        <p key={index}>{item}</p>
                                    ))}
                                </div>
                                <div className="order-product-price-container">
                                    {mainOrderProduct.sale_price === "" ? (
                                        <p className="order-product-regular-price">{formatedPrice(mainOrderProduct.regular_price)}</p>
                                    ) : (
                                        <span className="order-product-sale-price-container">
                                            <h3>{formatedPrice(mainOrderProduct.sale_price)}</h3>
                                            <del>{formatedPrice(mainOrderProduct.regular_price)}</del>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-remaining-products-container">
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className={`order-thumb-product ${item._id === mainOrderProduct._id ? 'active-current-product' : ''}`}
                                onClick={() => handleSelectedProduct(item)}
                            >
                                <div className="order-thumb-image-container">
                                    <Image src={url + item.image} width={80} height={80} alt="remaining img" />
                                </div>
                                {item.sale_price === "" ? (
                                    <p className="remaining_price">{formatedPrice(item.regular_price)}</p>
                                ) : (
                                    <p className="remaining_price">{formatedPrice(item.sale_price)}</p>
                                )}
                            </div>
                        ))}


                    </div>

                    {/* {order.items.map((item, index) => (
                        <CartItemOC
                            image={item.image}
                            name={item.name}
                            quantity={item.quantity}
                            price={item.total}
                            sku={item.sku}
                            key={index}
                            item={item}
                            regular_price={item?.regular_price}
                            options={item.attributes}
                            cart_protected={order.cart_protected}
                            is_protected={order.is_protected}
                            protected_price={order.protected_price}
                        />
                    ))} */}



                </div>


                <div className="cart_product_calculations">
                    <div className="row">
                        <p className="label">Sub Total</p>
                        <p className="value">{formatedPrice(order.sub_total)}</p> {/* Use order data */}
                    </div>
                    {order.professional_assembled === 1 && <div className="row">
                        <p className="label">White Glove</p>
                        <p className="value">{formatedPrice(order.professional_assembled_price)}</p> {/* Use order data */}
                    </div>}
                    {order.cart_protected === 1 && <div className="row">
                        <p className="label">Cart Protected</p>
                        <p className="value">{formatedPrice(order.cart_protection_price)}</p> {/* Use order data */}
                    </div>}
                    <div className="row">
                        <p className="label">Shipping</p>
                        <p className="value">{formatedPrice(order.shipping_cost)}</p> {/* Use order data */}
                    </div>
                    <div className="row">
                        <p className="label">Tax</p>
                        <p className="value">{formatedPrice(order.tax)}</p> {/* Use order data */}
                    </div>
                    <span className="separator"></span>
                    <div className="row">
                        <p className="label_result">Total</p>
                        <p className="value_result">{formatedPrice(order.total)}</p> {/* Use order data */}
                    </div>


                    {/* <div className="checkout-need-help-or-continue-shopping">
                        <span className="checkout-page-contact-us-link-item">
                            <p className="checkout-need-help-heading">Need help?</p>
                            <Link className="checkout-contact-item" href={'/contact-us'}>Contact us</Link>
                        </span>
                        <button className="checkout-continue-shopping-button" onClick={handleNavigate}>
                            Go To Home
                        </button>
                    </div> */}
                </div>

                <div className="mob-checkout-need-help-or-continue-shopping">
                    <span className="checkout-page-contact-us-link-item">
                        <p className="checkout-need-help-heading">Need help?</p>
                        <Link className="checkout-contact-item" href={'/contact-us'}>Contact us</Link>
                    </span>
                    <button className="checkout-continue-shopping-button" onClick={handleNavigate}>
                        Go To Home
                    </button>
                </div>
            </div>
        </div>
    );
}
