// Toaster 配置选项
export const toastConfig = {
    // 位置选项
    positions: {
      'top-left': 'top-left',
      'top-center': 'top-center', 
      'top-right': 'top-right',
      'bottom-left': 'bottom-left',
      'bottom-center': 'bottom-center',
      'bottom-right': 'bottom-right',
      'center': 'center',
    } as const,
  
    // 默认配置
    default: {
      position: 'top-center' as const,
      duration: 3000,
      style: {
        background: 'rgba(15, 23, 42, 0.95)', // slate-900 半透明
        color: '#f1f5f9', // slate-100
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(148, 163, 184, 0.2)', // slate-400 边框
      },
    },
  
    // 成功提示配置
    success: {
      duration: 3000,
      style: {
        background: 'rgba(16, 185, 129, 0.95)', // emerald-500 半透明，与复制成功状态一致
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
    },
  
    // 错误提示配置
    error: {
      duration: 5000,
      style: {
        background: 'rgba(244, 63, 94, 0.95)', // rose-500 半透明，与项目错误提示一致
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#F43F5E',
      },
    },
  
    // 警告提示配置
    warning: {
      duration: 4000,
      style: {
        background: 'rgba(251, 146, 60, 0.95)', // orange-400 半透明
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 12px rgba(251, 146, 60, 0.3)',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#FB923C',
      },
    },
  
    // 信息提示配置
    info: {
      duration: 3000,
      style: {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%)', // indigo-500 to violet-500 渐变，与主按钮一致
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: '500',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#6366F1',
      },
    },
  
    // 容器配置
    container: {
      style: {
        top: 20,
        left: 20,
        bottom: 20,
        right: 20,
      },
      className: 'custom-toaster-container',
    },
  
    // 移动端容器配置（避免刘海屏遮挡）
    mobileContainer: {
      style: {
        top: 'calc(20px + env(safe-area-inset-top))',
        left: 20,
        bottom: 20,
        right: 20,
      },
      className: 'custom-toaster-container mobile-safe',
    },
  
      // 响应式配置
    responsive: {
      mobile: {
        style: {
          margin: '8px',
          borderRadius: '10px', // 保持圆角与项目一致
          padding: '10px 14px',
          fontSize: '13px',
        },
      },
      tablet: {
        style: {
          margin: '10px',
          borderRadius: '12px', // 保持圆角与项目一致
          padding: '12px 16px',
          fontSize: '14px',
        },
      },
    },
  }
  
  // 获取响应式配置
  export const getResponsiveConfig = () => {
    if (typeof window === 'undefined') return toastConfig.default
    
    const width = window.innerWidth
    
    if (width < 768) {
      return {
        ...toastConfig.default,
        style: {
          ...toastConfig.default.style,
          ...toastConfig.responsive.mobile.style,
        },
      }
    }
    
    if (width < 1024) {
      return {
        ...toastConfig.default,
        style: {
          ...toastConfig.default.style,
          ...toastConfig.responsive.tablet.style,
        },
      }
    }
    
    return toastConfig.default
  }
  
  // 获取响应式容器配置
  export const getResponsiveContainerConfig = () => {
    if (typeof window === 'undefined') return toastConfig.container
    
    const width = window.innerWidth
    
    if (width < 768) {
      return toastConfig.mobileContainer
    }
    
    return toastConfig.container
  }
  
  // 主题配置
  export const toastThemes = {
    light: {
      background: 'rgba(255, 255, 255, 0.9)', // 白色半透明，与卡片背景一致
      color: '#1e293b', // slate-800
      border: '1px solid rgba(226, 232, 240, 0.8)', // slate-200 边框
    },
    dark: {
      background: 'rgba(30, 41, 59, 0.9)', // slate-800 半透明，与深色模式卡片一致
      color: '#f1f5f9', // slate-100
      border: '1px solid rgba(51, 65, 85, 0.8)', // slate-700 边框
    },
    gradient: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(236, 72, 153, 0.95) 100%)', // indigo-500 to pink-500 渐变，与项目主标题渐变一致
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  }
  