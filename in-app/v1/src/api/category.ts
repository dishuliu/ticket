import { UseQueryOptions, useQuery } from 'react-query';
import { useRootCategory } from '@/states/root-category';
import { http } from '@/leancloud';
import { Article } from '@/types';
import { useTranslation } from 'react-i18next';

export interface Category {
  id: string;
  name: string;
  alias?: string;
  parentId?: string;
  position: number;
  formId?: string;
  hidden?: boolean;
}

async function fetchCategories(rootCategoryId: string): Promise<Category[]> {
  const { data } = await http.get<Category[]>(`/api/2/products/${rootCategoryId}/categories`, {
    params: {
      active: 1,
    },
  });
  return data;
}

async function fetchCategory(id: string) {
  const { data } = await http.get<Category>(`/api/2/categories/${id}`);
  return data;
}

export interface CategoryTopics {
  id: string;
  name: string;
  articleIds: string[];
  articles: Article[];
}

async function fetchCategoryTopic(categoryId: string, locale?: string): Promise<CategoryTopics[]> {
  const { data } = await http.get(`/api/2/categories/${categoryId}/topics`, {
    params: {
      locale,
    },
  });
  return data;
}

export function useCategories(options?: UseQueryOptions<Category[]>) {
  const rootCategory = useRootCategory();
  return useQuery({
    queryKey: ['categories', rootCategory.id],
    queryFn: () => fetchCategories(rootCategory.id),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useCategory(id: string, options?: UseQueryOptions<Category>) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => fetchCategory(id),
    ...options,
  });
}

export function useCategoryTopics(options?: UseQueryOptions<CategoryTopics[]>) {
  const rootCategory = useRootCategory();
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: ['categoryTopic', rootCategory.id],
    queryFn: () => fetchCategoryTopic(rootCategory.id, i18n.language),
    staleTime: Infinity,
    ...options,
  });
}
