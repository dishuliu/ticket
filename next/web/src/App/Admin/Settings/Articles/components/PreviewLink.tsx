import { useCategories } from '@/api/category';
import { Tooltip } from 'antd';
import { useMemo } from 'react';

export interface PreviewLinkProps {
  slug: string;
  language?: string;
}

export const PreviewLink = ({ slug, language }: PreviewLinkProps) => {
  const { data: categories, isLoading } = useCategories({ active: true });

  const productId = useMemo(() => categories?.[0]?.id, [categories]);

  return productId ? (
    <a
      href={`/in-app/v1/products/${productId}/articles/${slug}?nav=0${
        language ? `&lang=${language}` : ''
      }`}
      target="_blank"
      rel="noreferrer noopener"
    >
      文章预览
    </a>
  ) : (
    <Tooltip title="你需要一个启用中的产品来使用预览" visible={isLoading ? undefined : false}>
      <div className="text-gray-400">文章预览</div>
    </Tooltip>
  );
};
