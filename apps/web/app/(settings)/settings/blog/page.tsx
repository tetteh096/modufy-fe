"use client";

import { PenLine } from "lucide-react";
import { ModuleSettingsPage } from "@/components/features/settings/module-settings-page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/lib/api";

export default function BlogSettingsPage() {
  const { data: business } = useQuery({
    queryKey: ["business"],
    queryFn: businessApi.get,
  });

  const blogUrl = business?.slug ? `/p/${business.slug}/blog` : null;

  return (
    <ModuleSettingsPage
      moduleKey="blog"
      title="Blog"
      description="SEO articles on your public storefront"
      icon={PenLine}
    >
      <Card>
        <CardHeader>
          <CardTitle>Public blog URL</CardTitle>
          <CardDescription>
            Published posts appear on your storefront for search engines and visitors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {blogUrl ? (
            <p>
              Your blog lives at{" "}
              <a href={blogUrl} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                {blogUrl}
              </a>
            </p>
          ) : (
            <p>Set your storefront slug under Settings → Storefront to get a public blog URL.</p>
          )}
          <ul className="list-disc pl-5 space-y-1">
            <li>Use SEO title and meta description on each post for Google snippets.</li>
            <li>Publish only when content is ready — drafts stay private.</li>
            <li>Share post links on social media to drive traffic to your storefront.</li>
          </ul>
        </CardContent>
      </Card>
    </ModuleSettingsPage>
  );
}
